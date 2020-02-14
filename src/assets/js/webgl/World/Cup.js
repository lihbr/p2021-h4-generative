import {
  Mesh,
  Object3D,
  CylinderGeometry,
  DoubleSide,
  FrontSide,
  BackSide,
  RingBufferGeometry,
  CircleBufferGeometry,
  BoxBufferGeometry,
  MeshPhysicalMaterial,
  ClampToEdgeWrapping,
  CubeUVReflectionMapping,
  MeshBasicMaterial,
  TextureLoader,
  RepeatWrapping,
  Vector2
} from "three";

export default class Cup {
  constructor({
    radiusTop = 3.5,
    radiusBottom = 2.5,
    height = 11.5,
    supportsNum = 9,
    details = 30,
    texturePath
  } = {}) {
    this.object = new Object3D();
    this.cup = new Object3D();

    const loader = new TextureLoader();
    const texture = loader.load(texturePath);
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    const textureMaterial = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: DoubleSide
    });

    const material = {
      color: 0xbbbbaa,
      transparent: true,
      opacity: 0.75,
      roughness: 0.7,
      metalness: 0.2,
      reflectivity: 0.5,
      depthTest: true,
      depthWrite: true
    };

    const frontMaterial = new MeshPhysicalMaterial({
      ...material,
      side: FrontSide
    });
    const backMaterial = new MeshPhysicalMaterial({
      ...material,
      side: BackSide
    });
    const doubleMaterial = new MeshPhysicalMaterial({
      ...material,
      side: DoubleSide
    });

    const bodyGeometry = new CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      details,
      1,
      true
    );

    const outerSide = new Mesh(bodyGeometry, frontMaterial);
    this.cup.add(outerSide);

    const outerSideTexture = new Mesh(
      bodyGeometry.clone().scale(1.001, 1.001, 1.001),
      textureMaterial
    );
    this.cup.add(outerSideTexture);

    const innerSide = new Mesh(
      bodyGeometry.clone().scale(0.96, 1, 0.96),
      backMaterial
    );
    this.cup.add(innerSide);

    const topRing = new Mesh(
      new RingBufferGeometry(radiusTop * 0.95, radiusTop, details),
      frontMaterial
    );
    topRing.rotation.x = -Math.PI / 2;
    topRing.position.y = height / 2;
    this.cup.add(topRing);

    const bottom = new Mesh(
      new CircleBufferGeometry(radiusBottom, details),
      doubleMaterial
    );
    bottom.rotation.x = Math.PI / 2;
    bottom.position.y = -height / 2;
    this.cup.add(bottom);

    const supports = new Object3D();

    for (let i = 0; i < supportsNum; i++) {
      const support = new Mesh(
        new BoxBufferGeometry(height / 100, height / 10, height / 100),
        frontMaterial
      );
      support.rotation.y = ((Math.PI * 2) / supportsNum) * i;
      support.translateZ(radiusBottom * 0.97);
      supports.add(support);
    }
    supports.position.y = height / 20 - height / 2;
    this.cup.add(supports);

    this.cup.rotation.set(-Math.PI / 2, 0, 0);
    this.cup.scale.set(5, 5, 5);

    this.object.name = `cup-${this.object.uuid}`;
    const _buffer = new Object3D();
    _buffer.add(this.cup);
    this.object.add(_buffer);
  }
}
