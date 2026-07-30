/**
 * Grainient — full-viewport animated gradient.
 *
 * A warped, grainy three-colour gradient drawn by a single fragment shader over
 * a full-screen triangle. The GLSL is unchanged from the reference
 * implementation; the ogl dependency is replaced with plain WebGL2 so this
 * needs no build step.
 */
(function () {
  "use strict";

  var VERTEX_SHADER = [
    "#version 300 es",
    "in vec2 position;",
    "void main() {",
    "  gl_Position = vec4(position, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAGMENT_SHADER = [
    "#version 300 es",
    "precision highp float;",
    "uniform vec2 iResolution;",
    "uniform float iTime;",
    "uniform float uTimeSpeed;",
    "uniform float uColorBalance;",
    "uniform float uWarpStrength;",
    "uniform float uWarpFrequency;",
    "uniform float uWarpSpeed;",
    "uniform float uWarpAmplitude;",
    "uniform float uBlendAngle;",
    "uniform float uBlendSoftness;",
    "uniform float uRotationAmount;",
    "uniform float uNoiseScale;",
    "uniform float uGrainAmount;",
    "uniform float uGrainScale;",
    "uniform float uGrainAnimated;",
    "uniform float uContrast;",
    "uniform float uGamma;",
    "uniform float uSaturation;",
    "uniform vec2 uCenterOffset;",
    "uniform float uZoom;",
    "uniform vec3 uColor1;",
    "uniform vec3 uColor2;",
    "uniform vec3 uColor3;",
    "out vec4 fragColor;",
    "#define S(a,b,t) smoothstep(a,b,t)",
    "mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}",
    "vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}",
    "void mainImage(out vec4 o, vec2 C){",
    "  float t=iTime*uTimeSpeed;",
    "  vec2 uv=C/iResolution.xy;",
    "  float ratio=iResolution.x/iResolution.y;",
    "  vec2 tuv=uv-0.5+uCenterOffset;",
    "  tuv/=max(uZoom,0.001);",
    "",
    "  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);",
    "  tuv.y*=1.0/ratio;",
    "  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));",
    "  tuv.y*=ratio;",
    "",
    "  float frequency=uWarpFrequency;",
    "  float ws=max(uWarpStrength,0.001);",
    "  float amplitude=uWarpAmplitude/ws;",
    "  float warpTime=t*uWarpSpeed;",
    "  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;",
    "  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);",
    "",
    "  vec3 colLav=uColor1;",
    "  vec3 colOrg=uColor2;",
    "  vec3 colDark=uColor3;",
    "  float b=uColorBalance;",
    "  float s=max(uBlendSoftness,0.0);",
    "  mat2 blendRot=Rot(radians(uBlendAngle));",
    "  float blendX=(tuv*blendRot).x;",
    "  float edge0=-0.3-b-s;",
    "  float edge1=0.2-b+s;",
    "  float v0=0.5-b+s;",
    "  float v1=-0.3-b-s;",
    "  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));",
    "  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));",
    "  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));",
    "",
    "  vec2 grainUv=uv*max(uGrainScale,0.001);",
    "  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}",
    "  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);",
    "  col+=(grain-0.5)*uGrainAmount;",
    "",
    "  col=(col-0.5)*uContrast+0.5;",
    "  float luma=dot(col,vec3(0.2126,0.7152,0.0722));",
    "  col=mix(vec3(luma),col,uSaturation);",
    "  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));",
    "  col=clamp(col,0.0,1.0);",
    "",
    "  o=vec4(col,1.0);",
    "}",
    "void main(){",
    "  vec4 o=vec4(0.0);",
    "  mainImage(o,gl_FragCoord.xy);",
    "  fragColor=o;",
    "}"
  ].join("\n");

  var DEFAULTS = {
    color1: "#9ebed8",
    color2: "#16293f",
    color3: "#3d5c7a",
    timeSpeed: 0.5,
    colorBalance: 0.0,
    warpStrength: 1.0,
    warpFrequency: 5.0,
    warpSpeed: 2.0,
    warpAmplitude: 50.0,
    blendAngle: 0.0,
    blendSoftness: 0.05,
    rotationAmount: 500.0,
    noiseScale: 2.0,
    grainAmount: 0.05,
    grainScale: 2.0,
    grainAnimated: false,
    contrast: 1.5,
    gamma: 1.0,
    saturation: 1.0,
    centerX: 0.0,
    centerY: 0.0,
    zoom: 0.9
  };

  function hexToRgb(hex) {
    var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!match) return [1, 1, 1];

    return [
      parseInt(match[1], 16) / 255,
      parseInt(match[2], 16) / 255,
      parseInt(match[3], 16) / 255
    ];
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("Shader compile failed: " + log);
    }

    return shader;
  }

  function createProgram(gl) {
    var vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    var fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    var program = gl.createProgram();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error("Program link failed: " + log);
    }

    return program;
  }

  /**
   * Mounts the gradient into `container`. Returns a teardown function, or null
   * if WebGL2 is unavailable (in which case a CSS fallback is flagged on the
   * container).
   */
  function mount(container, options) {
    var settings = Object.assign({}, DEFAULTS, options || {});
    var canvas = document.createElement("canvas");
    // No preserveDrawingBuffer: it forces the driver to keep a spare copy of
    // the buffer every frame. Adaptive-tone reads pixels immediately after
    // drawArrays in the same frame, which is valid without it.
    var gl = canvas.getContext("webgl2", { alpha: true, antialias: false });

    if (!gl) {
      container.setAttribute("data-fallback", "true");
      return null;
    }

    var program;

    try {
      program = createProgram(gl);
    } catch (error) {
      container.setAttribute("data-fallback", "true");
      if (window.console && console.warn) console.warn("[grainient]", error);
      return null;
    }

    canvas.className = "grainient-canvas";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    // Full-screen triangle: cheaper than a quad and needs no indices.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);

    var positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    function uniform(name) {
      return gl.getUniformLocation(program, name);
    }

    var uniforms = {
      iTime: uniform("iTime"),
      iResolution: uniform("iResolution")
    };

    // Scalar uniforms map 1:1 to settings keys.
    var scalars = {
      uTimeSpeed: "timeSpeed",
      uColorBalance: "colorBalance",
      uWarpStrength: "warpStrength",
      uWarpFrequency: "warpFrequency",
      uWarpSpeed: "warpSpeed",
      uWarpAmplitude: "warpAmplitude",
      uBlendAngle: "blendAngle",
      uBlendSoftness: "blendSoftness",
      uRotationAmount: "rotationAmount",
      uNoiseScale: "noiseScale",
      uGrainAmount: "grainAmount",
      uGrainScale: "grainScale",
      uContrast: "contrast",
      uGamma: "gamma",
      uSaturation: "saturation",
      uZoom: "zoom"
    };

    Object.keys(scalars).forEach(function (name) {
      gl.uniform1f(uniform(name), settings[scalars[name]]);
    });

    gl.uniform1f(uniform("uGrainAnimated"), settings.grainAnimated ? 1.0 : 0.0);
    gl.uniform2f(uniform("uCenterOffset"), settings.centerX, settings.centerY);
    gl.uniform3fv(uniform("uColor1"), hexToRgb(settings.color1));
    gl.uniform3fv(uniform("uColor2"), hexToRgb(settings.color2));
    gl.uniform3fv(uniform("uColor3"), hexToRgb(settings.color3));

    // Render below device resolution — the gradient is soft, so nothing is
    // lost, and it frees GPU for the rest of the page. Frame *rate* is left
    // alone deliberately: capping rAF to an interval that isn't an exact
    // divisor of the display refresh rate makes frames land unevenly, which
    // reads as stutter on any continuous motion.
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var frameId = 0;
    var startedAt = performance.now();

    /* Adaptive tone needs to know the gradient's brightness under each bit of
       text. Reading that from the visible canvas means a readPixels per sample
       point, and every one of those stalls the CPU until the GPU pipeline
       drains — a periodic hitch you can see in any animation running alongside.

       Instead the same shader is drawn once into this tiny offscreen buffer and
       read back in a single call, then sampled purely on the CPU. One small
       stall every SYNC_INTERVAL_MS instead of dozens of full-pipeline ones. */
    var SAMPLE_WIDTH = 160;
    var sampleW = SAMPLE_WIDTH;
    var sampleH = 90;
    var samplePixels = new Uint8Array(sampleW * sampleH * 4);
    var sampleTexture = gl.createTexture();
    var sampleFbo = gl.createFramebuffer();

    function resizeSampleTarget(width, height) {
      // Must keep the canvas aspect ratio or the shader renders a different
      // image here than the one on screen.
      sampleW = SAMPLE_WIDTH;
      sampleH = Math.max(1, Math.round(SAMPLE_WIDTH * (height / Math.max(width, 1))));

      var needed = sampleW * sampleH * 4;
      if (samplePixels.length !== needed) samplePixels = new Uint8Array(needed);

      gl.bindTexture(gl.TEXTURE_2D, sampleTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sampleW, sampleH, 0, gl.RGBA,
        gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.bindFramebuffer(gl.FRAMEBUFFER, sampleFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
        sampleTexture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /** Redraws the gradient small and pulls the whole thing back in one read. */
    function refreshSample() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, sampleFbo);
      gl.viewport(0, 0, sampleW, sampleH);
      gl.uniform2f(uniforms.iResolution, sampleW, sampleH);
      gl.uniform1f(uniforms.iTime, (performance.now() - startedAt) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.readPixels(0, 0, sampleW, sampleH, gl.RGBA, gl.UNSIGNED_BYTE, samplePixels);

      // Restore everything the visible pass depends on.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uniforms.iResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    /** Luminance at a viewport coordinate, read from the CPU-side copy. */
    function sampleLuminance(viewportX, viewportY) {
      var rect = canvas.getBoundingClientRect();

      if (
        viewportX < rect.left || viewportX > rect.right ||
        viewportY < rect.top || viewportY > rect.bottom
      ) {
        return null;
      }

      var x = Math.min(sampleW - 1, Math.max(0,
        Math.round(((viewportX - rect.left) / Math.max(rect.width, 1)) * (sampleW - 1))));
      // GL's origin is bottom-left, the viewport's is top-left.
      var y = Math.min(sampleH - 1, Math.max(0,
        Math.round(((rect.bottom - viewportY) / Math.max(rect.height, 1)) * (sampleH - 1))));

      var i = (y * sampleW + x) * 4;

      return (
        (0.2126 * samplePixels[i] +
         0.7152 * samplePixels[i + 1] +
         0.0722 * samplePixels[i + 2]) / 255
      );
    }

    function render(elapsedSeconds) {
      gl.uniform1f(uniforms.iTime, elapsedSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function setSize() {
      var rect = container.getBoundingClientRect();
      var width = Math.max(1, Math.floor(rect.width));
      var height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      resizeSampleTarget(gl.drawingBufferWidth, gl.drawingBufferHeight);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uniforms.iResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);

      render((performance.now() - startedAt) * 0.001);

      if (window.AdaptiveText) window.AdaptiveText.sync(true);
    }

    var resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    if (window.AdaptiveText) {
      window.AdaptiveText.setSampler(sampleLuminance, refreshSample);
    }

    function loop(time) {
      frameId = window.requestAnimationFrame(loop);

      if (document.hidden) return;

      render((time - startedAt) * 0.001);
      // Internally throttled, and it no longer touches the visible buffer.
      if (window.AdaptiveText) window.AdaptiveText.sync(false);
    }

    frameId = window.requestAnimationFrame(loop);

    return function destroy() {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      if (window.AdaptiveText) window.AdaptiveText.setSampler(null);
      if (canvas.parentNode === container) container.removeChild(canvas);

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteFramebuffer(sampleFbo);
      gl.deleteTexture(sampleTexture);

      var loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) loseContext.loseContext();
    };
  }

  window.Grainient = { mount: mount, DEFAULTS: DEFAULTS };
})();
