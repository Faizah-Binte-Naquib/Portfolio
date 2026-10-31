import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

const canvas = document.getElementById('perceptionCanvas');

if (canvas) {
  const CAMERA_COLOR = 0x8bc7ad;
  const LIDAR_COLOR = 0xd68a65;
  const POINT_COLOR = 0xdbe9e3;
  const ROAD_COLOR = 0x42675c;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x10221d, 0.075);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 3.2, 8.6);
  camera.lookAt(0, -0.15, -1.7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x10221d, 1);

  const world = new THREE.Group();
  scene.add(world);

  function makePoints(positionArray, color, size = 0.045, opacity = 1) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, transparent: opacity < 1, opacity }));
  }

  const roadPositions = [];
  const shoulderPositions = [];
  for (let i = 0; i < 1050; i += 1) {
    const z = THREE.MathUtils.randFloat(-9, 4);
    const x = THREE.MathUtils.randFloat(-4.2, 4.2);
    const onRoad = Math.abs(x) < 2.35;
    const y = -1.23 + Math.sin(z * 1.25 + x * .8) * .025 + (onRoad ? 0 : Math.min(Math.abs(x) - 2.35, 1.5) * .22 + Math.random() * .12);
    (onRoad ? roadPositions : shoulderPositions).push(x, y, z);
  }
  world.add(makePoints(roadPositions, POINT_COLOR, 0.025, .55));
  world.add(makePoints(shoulderPositions, ROAD_COLOR, 0.035, .75));

  const laneMaterial = new THREE.LineDashedMaterial({ color: 0x6b8e82, dashSize: .28, gapSize: .25, transparent: true, opacity: .45 });
  [-2.25, 0, 2.25].forEach((x, index) => {
    const points = [new THREE.Vector3(x, -1.18, 3.5), new THREE.Vector3(x, -1.18, -8.5)];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), laneMaterial.clone());
    line.computeLineDistances();
    if (index !== 1) line.material.opacity = .25;
    world.add(line);
  });

  function addLimb(points, start, end, count, scatter = .035) {
    for (let i = 0; i < count; i += 1) {
      const t = Math.random();
      points.push(
        THREE.MathUtils.lerp(start.x, end.x, t) + THREE.MathUtils.randFloatSpread(scatter),
        THREE.MathUtils.lerp(start.y, end.y, t) + THREE.MathUtils.randFloatSpread(scatter),
        THREE.MathUtils.lerp(start.z, end.z, t) + THREE.MathUtils.randFloatSpread(scatter)
      );
    }
  }

  function addHumanPointCloud(x, z, scale = 1) {
    const person = new THREE.Group();
    person.position.set(x, -1.15, z);
    person.scale.setScalar(scale);
    const points = [];

    for (let i = 0; i < 95; i += 1) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = .16 + THREE.MathUtils.randFloatSpread(.025);
      points.push(Math.sin(phi) * Math.cos(theta) * radius, 1.72 + Math.cos(phi) * radius, Math.sin(phi) * Math.sin(theta) * radius);
    }
    for (let i = 0; i < 150; i += 1) {
      const y = THREE.MathUtils.randFloat(.82, 1.52);
      const taper = .2 + (1.52 - y) * .09;
      const angle = Math.random() * Math.PI * 2;
      points.push(Math.cos(angle) * taper, y, Math.sin(angle) * .14);
    }
    addLimb(points, new THREE.Vector3(-.18, 1.38, 0), new THREE.Vector3(-.43, .82, .03), 58);
    addLimb(points, new THREE.Vector3(.18, 1.38, 0), new THREE.Vector3(.43, .82, -.03), 58);
    addLimb(points, new THREE.Vector3(-.11, .84, 0), new THREE.Vector3(-.18, 0, .03), 74, .045);
    addLimb(points, new THREE.Vector3(.11, .84, 0), new THREE.Vector3(.2, 0, -.03), 74, .045);

    person.add(makePoints(points, POINT_COLOR, .055));
    world.add(person);

    const centerY = -1.15 + .9 * scale;
    const boxGeometry = new THREE.BoxGeometry(.92 * scale, 2.05 * scale, .72 * scale);
    const lidarBox = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeometry), new THREE.LineBasicMaterial({ color: LIDAR_COLOR, transparent: true, opacity: .78 }));
    lidarBox.position.set(x, centerY, z);
    world.add(lidarBox);

    const yoloShape = new THREE.Shape();
    const halfW = .55 * scale;
    const halfH = 1.18 * scale;
    const yoloPoints = [
      new THREE.Vector3(x - halfW, centerY - halfH, z + .43 * scale),
      new THREE.Vector3(x + halfW, centerY - halfH, z + .43 * scale),
      new THREE.Vector3(x + halfW, centerY + halfH, z + .43 * scale),
      new THREE.Vector3(x - halfW, centerY + halfH, z + .43 * scale)
    ];
    const yoloBox = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(yoloPoints), new THREE.LineBasicMaterial({ color: CAMERA_COLOR, transparent: true, opacity: .9 }));
    world.add(yoloBox);

    return { person, lidarBox, yoloBox, x, z, centerY, scale };
  }

  const pedestrians = [addHumanPointCloud(.78, -2.35, 1), addHumanPointCloud(-1.35, -5.25, .78)];

  function makeLabel(text, color) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 320;
    labelCanvas.height = 56;
    const context = labelCanvas.getContext('2d');
    context.fillStyle = 'rgba(16,34,29,.88)';
    context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
    context.strokeStyle = `#${new THREE.Color(color).getHexString()}`;
    context.lineWidth = 3;
    context.strokeRect(1.5, 1.5, labelCanvas.width - 3, labelCanvas.height - 3);
    context.fillStyle = '#eef6f2';
    context.font = '24px monospace';
    context.fillText(text, 14, 36);
    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.minFilter = THREE.LinearFilter;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.scale.set(1.75, .31, 1);
    return sprite;
  }

  const yoloLabel = makeLabel('YOLO  person  .94', CAMERA_COLOR);
  yoloLabel.position.set(.78, .55, -1.85);
  world.add(yoloLabel);
  const centerPointLabel = makeLabel('CenterPoint  pedestrian', LIDAR_COLOR);
  centerPointLabel.position.set(.78, .13, -1.84);
  world.add(centerPointLabel);

  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.15, .34, 1.9), new THREE.MeshBasicMaterial({ color: 0xdfeae5, wireframe: true, transparent: true, opacity: .9 }));
  body.position.y = .27;
  car.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(.8, .34, .78), new THREE.MeshBasicMaterial({ color: CAMERA_COLOR, wireframe: true, transparent: true, opacity: .75 }));
  cabin.position.set(0, .59, .12);
  car.add(cabin);
  const sensor = new THREE.Mesh(new THREE.CylinderGeometry(.1, .12, .12, 12), new THREE.MeshBasicMaterial({ color: LIDAR_COLOR }));
  sensor.position.set(0, .83, 0);
  car.add(sensor);
  [[-.64,.16,.58],[.64,.16,.58],[-.64,.16,-.58],[.64,.16,-.58]].forEach(([x,y,z]) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(.17, .045, 6, 12), new THREE.MeshBasicMaterial({ color: 0x71817a }));
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(x,y,z);
    car.add(wheel);
  });
  car.position.set(-.65, -1.12, 2.25);
  world.add(car);

  const lidarRings = [];
  for (let radius = .55; radius <= 2.2; radius += .55) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius * .34, 0, Math.PI * 2);
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)), new THREE.LineBasicMaterial({ color: LIDAR_COLOR, transparent: true, opacity: .2 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(car.position.x, -1.0, car.position.z - .1);
    world.add(ring);
    lidarRings.push(ring);
  }

  const sensorOrigin = new THREE.Vector3(car.position.x, -.35, car.position.z - .75);
  const frustumCorners = [new THREE.Vector3(-2.7,-1.15,-5.8), new THREE.Vector3(2.7,-1.15,-5.8), new THREE.Vector3(-2.7,1.5,-5.8), new THREE.Vector3(2.7,1.5,-5.8)];
  const frustumPositions = [];
  frustumCorners.forEach((corner) => frustumPositions.push(sensorOrigin.x,sensorOrigin.y,sensorOrigin.z,corner.x,corner.y,corner.z));
  const frustum = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(frustumPositions, 3)), new THREE.LineBasicMaterial({ color: CAMERA_COLOR, transparent: true, opacity: .12 }));
  world.add(frustum);

  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(car.position.x, -1.03, 1.3),
    new THREE.Vector3(-.78, -1.02, -.1),
    new THREE.Vector3(-1.25, -1.01, -1.65),
    new THREE.Vector3(-1.35, -1, -3.2),
    new THREE.Vector3(-.9, -.99, -5.2)
  ]);
  const pathTube = new THREE.Mesh(new THREE.TubeGeometry(pathCurve, 80, .025, 5, false), new THREE.MeshBasicMaterial({ color: CAMERA_COLOR, transparent: true, opacity: .85 }));
  world.add(pathTube);
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(.12, .34, 8), new THREE.MeshBasicMaterial({ color: CAMERA_COLOR }));
  arrow.position.copy(pathCurve.getPoint(.94));
  arrow.rotation.x = -Math.PI / 2;
  world.add(arrow);

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvas.addEventListener('pointermove', (event) => {
    const bounds = canvas.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - .5) * .18;
    targetY = ((event.clientY - bounds.top) / bounds.height - .5) * .08;
  });
  canvas.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function render(time = 0) {
    pointerX += (targetX - pointerX) * .055;
    pointerY += (targetY - pointerY) * .055;
    world.rotation.y = pointerX;
    world.rotation.x = pointerY;
    pedestrians.forEach((pedestrian, index) => {
      pedestrian.lidarBox.material.opacity = .58 + Math.sin(time * .0022 + index) * .22;
      pedestrian.yoloBox.material.opacity = .7 + Math.sin(time * .0018 + index) * .2;
    });
    lidarRings.forEach((ring, index) => { ring.material.opacity = .09 + ((Math.sin(time * .0018 - index * .8) + 1) * .08); });
    pathTube.material.opacity = .62 + Math.sin(time * .002) * .2;
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(render);
  }
  render();
}
