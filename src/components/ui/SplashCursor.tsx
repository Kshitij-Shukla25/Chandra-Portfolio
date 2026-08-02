// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'

export default function SplashCursor() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size immediately
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let active = true

    const config = {
      SIM_RESOLUTION: 128, DYE_RESOLUTION: 1440,
      DENSITY_DISSIPATION: 3.5, VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1, PRESSURE_ITERATIONS: 20,
      CURL: 3, SPLAT_RADIUS: 0.2, SPLAT_FORCE: 6000,
      COLOR_UPDATE_SPEED: 10, RAINBOW_MODE: true, COLOR: '#00aaff',
    }

    function Ptr() {
      this.id = -1; this.texcoordX = 0; this.texcoordY = 0
      this.prevTexcoordX = 0; this.prevTexcoordY = 0
      this.deltaX = 0; this.deltaY = 0
      this.down = false; this.moved = false; this.color = [0, 0, 0]
    }
    const ptrs = [new Ptr()]

    const pa = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }
    let gl = canvas.getContext('webgl2', pa)
    const isGL2 = !!gl
    if (!isGL2) gl = canvas.getContext('webgl', pa) || canvas.getContext('experimental-webgl', pa)

    if (!gl) { console.warn('WebGL not supported'); return }

    let hf, slf
    if (isGL2) { gl.getExtension('EXT_color_buffer_float'); slf = gl.getExtension('OES_texture_float_linear') }
    else { hf = gl.getExtension('OES_texture_half_float'); slf = gl.getExtension('OES_texture_half_float_linear') }
    gl.clearColor(0, 0, 0, 1)
    const hftt = isGL2 ? gl.HALF_FLOAT : (hf && hf.HALF_FLOAT_OES)

    function sfmt(iF, fmt, t) {
      const x = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, x)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, iF, 4, 4, 0, fmt, t, null)
      const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, x, 0)
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    }
    function gsf(iF, fmt, t) {
      if (!sfmt(iF, fmt, t)) {
        if (iF === gl.R16F) return gsf(gl.RG16F, gl.RG, t)
        if (iF === gl.RG16F) return gsf(gl.RGBA16F, gl.RGBA, t)
        return null
      }
      return { internalFormat: iF, format: fmt }
    }
    let fRGBA, fRG, fR
    if (isGL2) { fRGBA = gsf(gl.RGBA16F, gl.RGBA, hftt); fRG = gsf(gl.RG16F, gl.RG, hftt); fR = gsf(gl.R16F, gl.RED, hftt) }
    else { fRGBA = gsf(gl.RGBA, gl.RGBA, hftt); fRG = fRGBA; fR = fRGBA }
    if (!slf) { config.DYE_RESOLUTION = 256 }

    function csh(tp, src) { const s = gl.createShader(tp); gl.shaderSource(s, src); gl.compileShader(s); return s }
    function mkp(vs, fs) {
      const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
      const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
      for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm) }
      return { program: p, uniforms: u }
    }

    const bvs = csh(gl.VERTEX_SHADER, 'precision highp float;attribute vec2 aPosition;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform vec2 texelSize;void main(){vUv=aPosition*0.5+0.5;vL=vUv-vec2(texelSize.x,0.0);vR=vUv+vec2(texelSize.x,0.0);vT=vUv+vec2(0.0,texelSize.y);vB=vUv-vec2(0.0,texelSize.y);gl_Position=vec4(aPosition,0.0,1.0);}')
    const cpP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}'))
    const clP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}'))
    const spP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.0);}'))
    const avP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity;uniform sampler2D uSource;uniform vec2 texelSize;uniform float dt;uniform float dissipation;void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 result=texture2D(uSource,coord);float decay=1.0+dissipation*dt;gl_FragColor=result/decay;}'))
    const dvP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x;float R=texture2D(uVelocity,vR).x;float T=texture2D(uVelocity,vT).y;float B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.0){L=-C.x;}if(vR.x>1.0){R=-C.x;}if(vT.y>1.0){T=-C.y;}if(vB.y<0.0){B=-C.y;}float div=0.5*(R-L+T-B);gl_FragColor=vec4(div,0.0,0.0,1.0);}'))
    const cuP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y;float R=texture2D(uVelocity,vR).y;float T=texture2D(uVelocity,vT).x;float B=texture2D(uVelocity,vB).x;float vorticity=R-L-T+B;gl_FragColor=vec4(0.5*vorticity,0.0,0.0,1.0);}'))
    const voP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision highp float;precision highp sampler2D;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform sampler2D uVelocity;uniform sampler2D uCurl;uniform float curl;uniform float dt;void main(){float L=texture2D(uCurl,vL).x;float R=texture2D(uCurl,vR).x;float T=texture2D(uCurl,vT).x;float B=texture2D(uCurl,vB).x;float C=texture2D(uCurl,vUv).x;vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+0.0001;force*=curl*C;force.y*=-1.0;vec2 velocity=texture2D(uVelocity,vUv).xy;velocity+=force*dt;velocity=min(max(velocity,-1000.0),1000.0);gl_FragColor=vec4(velocity,0.0,1.0);}'))
    const prP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uPressure;uniform sampler2D uDivergence;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;float divergence=texture2D(uDivergence,vUv).x;float pressure=(L+R+B+T-divergence)*0.25;gl_FragColor=vec4(pressure,0.0,0.0,1.0);}'))
    const grP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uPressure;uniform sampler2D uVelocity;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;vec2 velocity=texture2D(uVelocity,vUv).xy;velocity.xy-=vec2(R-L,T-B);gl_FragColor=vec4(velocity,0.0,1.0);}'))
    const dpP = mkp(bvs, csh(gl.FRAGMENT_SHADER, 'precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;void main(){vec4 c=texture2D(uTexture,vUv);gl_FragColor=vec4(c.rgb,max(c.r,max(c.g,c.b)));}'))

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    function blit(t) {
      if (t == null) { gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null) }
      else { gl.viewport(0,0,t.width,t.height); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo) }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    }
    function cFBO(w, h, iF, fmt, tp, pm) {
      gl.activeTexture(gl.TEXTURE0)
      const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, pm)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, pm)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, iF, w, h, 0, fmt, tp, null)
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0)
      gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT)
      return { tx, fbo: fb, width: w, height: h, texelSizeX: 1/w, texelSizeY: 1/h, attach(id) { gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, tx); return id } }
    }
    function cdFBO(w, h, iF, fmt, tp, pm) {
      let f1 = cFBO(w,h,iF,fmt,tp,pm), f2 = cFBO(w,h,iF,fmt,tp,pm)
      return { width:w, height:h, texelSizeX:f1.texelSizeX, texelSizeY:f1.texelSizeY, get read(){return f1}, set read(v){f1=v}, get write(){return f2}, set write(v){f2=v}, swap(){const t=f1;f1=f2;f2=t} }
    }
    function rFBO(t, w, h, iF, fmt, tp, pm) { const n=cFBO(w,h,iF,fmt,tp,pm); gl.useProgram(cpP.program); gl.uniform1i(cpP.uniforms.uTexture,t.attach(0)); blit(n); return n }
    function rdFBO(t, w, h, iF, fmt, tp, pm) { if(t.width===w&&t.height===h)return t; t.read=rFBO(t.read,w,h,iF,fmt,tp,pm); t.write=cFBO(w,h,iF,fmt,tp,pm); t.width=w;t.height=h;t.texelSizeX=1/w;t.texelSizeY=1/h; return t }
    function gRes(r) { let ar=gl.drawingBufferWidth/gl.drawingBufferHeight; if(ar<1)ar=1/ar; const mn=Math.round(r),mx=Math.round(r*ar); return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx} }
    function scl(v) { return Math.floor(v*(window.devicePixelRatio||1)) }

    let dye, vel, div, curl, pres
    function iFBOs() {
      const sR=gRes(config.SIM_RESOLUTION), dR=gRes(config.DYE_RESOLUTION)
      const tt=hftt, fil=slf?gl.LINEAR:gl.NEAREST
      gl.disable(gl.BLEND)
      dye  = dye  ? rdFBO(dye, dR.width,dR.height, fRGBA.internalFormat,fRGBA.format,tt,fil) : cdFBO(dR.width,dR.height, fRGBA.internalFormat,fRGBA.format,tt,fil)
      vel  = vel  ? rdFBO(vel, sR.width,sR.height, fRG.internalFormat,fRG.format,tt,fil)     : cdFBO(sR.width,sR.height, fRG.internalFormat,fRG.format,tt,fil)
      div  = cFBO(sR.width,sR.height, fR.internalFormat,fR.format,tt,gl.NEAREST)
      curl = cFBO(sR.width,sR.height, fR.internalFormat,fR.format,tt,gl.NEAREST)
      pres = cdFBO(sR.width,sR.height, fR.internalFormat,fR.format,tt,gl.NEAREST)
    }
    iFBOs()

    function HSV(h,s,v){const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);const c=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];const[r,g,b]=c[i%6];return{r,g,b}}
    function gc(){const c=HSV(Math.random(),1,1);return{r:c.r*0.15,g:c.g*0.15,b:c.b*0.15}}
    function cR(r){const ar=canvas.width/canvas.height;return ar>1?r*ar:r}
    function cDX(d){const ar=canvas.width/canvas.height;return ar<1?d*ar:d}
    function cDY(d){const ar=canvas.width/canvas.height;return ar>1?d/ar:d}

    function splat(x,y,dx,dy,col){
      gl.useProgram(spP.program)
      gl.uniform1i(spP.uniforms.uTarget,vel.read.attach(0))
      gl.uniform1f(spP.uniforms.aspectRatio,canvas.width/canvas.height)
      gl.uniform2f(spP.uniforms.point,x,y)
      gl.uniform3f(spP.uniforms.color,dx,dy,0)
      gl.uniform1f(spP.uniforms.radius,cR(config.SPLAT_RADIUS/100))
      blit(vel.write); vel.swap()
      gl.uniform1i(spP.uniforms.uTarget,dye.read.attach(0))
      gl.uniform3f(spP.uniforms.color,col.r,col.g,col.b)
      blit(dye.write); dye.swap()
    }
    function spPtr(p){splat(p.texcoordX,p.texcoordY,p.deltaX*config.SPLAT_FORCE,p.deltaY*config.SPLAT_FORCE,p.color)}
    function ckS(p){const c=gc();c.r*=10;c.g*=10;c.b*=10;splat(p.texcoordX,p.texcoordY,10*(Math.random()-0.5),30*(Math.random()-0.5),c)}
    function pdD(p,id,x,y){p.id=id;p.down=true;p.moved=false;p.texcoordX=x/canvas.width;p.texcoordY=1-y/canvas.height;p.prevTexcoordX=p.texcoordX;p.prevTexcoordY=p.texcoordY;p.deltaX=0;p.deltaY=0;p.color=gc()}
    function pdM(p,x,y){p.prevTexcoordX=p.texcoordX;p.prevTexcoordY=p.texcoordY;p.texcoordX=x/canvas.width;p.texcoordY=1-y/canvas.height;p.deltaX=cDX(p.texcoordX-p.prevTexcoordX);p.deltaY=cDY(p.texcoordY-p.prevTexcoordY);p.moved=Math.abs(p.deltaX)>0||Math.abs(p.deltaY)>0}

    function step(dt){
      gl.disable(gl.BLEND)
      gl.useProgram(cuP.program); gl.uniform2f(cuP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(cuP.uniforms.uVelocity,vel.read.attach(0)); blit(curl)
      gl.useProgram(voP.program); gl.uniform2f(voP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(voP.uniforms.uVelocity,vel.read.attach(0)); gl.uniform1i(voP.uniforms.uCurl,curl.attach(1)); gl.uniform1f(voP.uniforms.curl,config.CURL); gl.uniform1f(voP.uniforms.dt,dt); blit(vel.write); vel.swap()
      gl.useProgram(dvP.program); gl.uniform2f(dvP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(dvP.uniforms.uVelocity,vel.read.attach(0)); blit(div)
      gl.useProgram(clP.program); gl.uniform1i(clP.uniforms.uTexture,pres.read.attach(0)); gl.uniform1f(clP.uniforms.value,config.PRESSURE); blit(pres.write); pres.swap()
      gl.useProgram(prP.program); gl.uniform2f(prP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(prP.uniforms.uDivergence,div.attach(0))
      for(let i=0;i<config.PRESSURE_ITERATIONS;i++){gl.uniform1i(prP.uniforms.uPressure,pres.read.attach(1));blit(pres.write);pres.swap()}
      gl.useProgram(grP.program); gl.uniform2f(grP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY); gl.uniform1i(grP.uniforms.uPressure,pres.read.attach(0)); gl.uniform1i(grP.uniforms.uVelocity,vel.read.attach(1)); blit(vel.write); vel.swap()
      gl.useProgram(avP.program); gl.uniform2f(avP.uniforms.texelSize,vel.texelSizeX,vel.texelSizeY)
      const vid=vel.read.attach(0); gl.uniform1i(avP.uniforms.uVelocity,vid); gl.uniform1i(avP.uniforms.uSource,vid); gl.uniform1f(avP.uniforms.dt,dt); gl.uniform1f(avP.uniforms.dissipation,config.VELOCITY_DISSIPATION); blit(vel.write); vel.swap()
      gl.uniform1i(avP.uniforms.uVelocity,vel.read.attach(0)); gl.uniform1i(avP.uniforms.uSource,dye.read.attach(1)); gl.uniform1f(avP.uniforms.dissipation,config.DENSITY_DISSIPATION); blit(dye.write); dye.swap()
    }
    function render(){
      gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND)
      gl.useProgram(dpP.program); gl.uniform1i(dpP.uniforms.uTexture,dye.read.attach(0)); blit(null)
    }

    let lt=Date.now(), ct=0
    function frame(){
      if(!active)return
      const now=Date.now(), dt=Math.min((now-lt)/1000,0.016666); lt=now
      const w=scl(canvas.clientWidth), h=scl(canvas.clientHeight)
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;iFBOs()}
      ct+=dt*config.COLOR_UPDATE_SPEED
      if(ct>=1){ct=ct%1;ptrs.forEach(p=>{p.color=gc()})}
      ptrs.forEach(p=>{if(p.moved){p.moved=false;spPtr(p)}})
      step(dt); render()
      rafRef.current=requestAnimationFrame(frame)
    }

    const oMD=e=>{const p=ptrs[0];pdD(p,-1,scl(e.clientX),scl(e.clientY));ckS(p)}
    const oMM=e=>{pdM(ptrs[0],scl(e.clientX),scl(e.clientY))}
    const oTS=e=>{Array.from(e.targetTouches).forEach(t=>pdD(ptrs[0],t.identifier,scl(t.clientX),scl(t.clientY)))}
    const oTM=e=>{Array.from(e.targetTouches).forEach(t=>pdM(ptrs[0],scl(t.clientX),scl(t.clientY)))}
    const oTE=()=>{ptrs[0].down=false}

    window.addEventListener('mousedown',oMD)
    window.addEventListener('mousemove',oMM)
    window.addEventListener('touchstart',oTS)
    window.addEventListener('touchmove',oTM,false)
    window.addEventListener('touchend',oTE)
    frame()

    return ()=>{
      active=false
      if(rafRef.current)cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousedown',oMD)
      window.removeEventListener('mousemove',oMM)
      window.removeEventListener('touchstart',oTS)
      window.removeEventListener('touchmove',oTM)
      window.removeEventListener('touchend',oTE)
    }
  }, [])

  return (
    <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:9999, pointerEvents:'none', overflow:'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display:'block', width:'100%', height:'100%' }}
      />
    </div>
  )
}