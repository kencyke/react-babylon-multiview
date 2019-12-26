import React from 'react';
import { Engine, Scene, SceneEventArgs, withBabylonJS } from 'react-babylonjs'
import { 
  Vector3,
  ArcRotateCamera,
  Viewport,
  Color3,
  Color4,
  Scalar,
  PointerInfo,
  Scene as BabylonJSScene,
  Nullable,
  AbstractMesh,
  Camera,
} from '@babylonjs/core';
import PointsCloud, { CloudPoint } from './components/PointsCloud';

var startingPoint: Nullable<Vector3>
var currentMesh: Nullable<AbstractMesh>
var cameraToPick: Camera | undefined

function setCameraToPick(scene: BabylonJSScene) {
  cameraToPick = undefined;

  const x = scene.pointerX;
  const y = scene.pointerY;
  const renderWidth = scene.getEngine().getRenderWidth(true);
  const renderHeight = scene.getEngine().getRenderHeight(true);
  scene.activeCameras.forEach(c => {
    const y1 = renderHeight - y;
    const absoluteViewport = c.viewport.toGlobal(renderWidth, renderHeight);
    console.log("renderWidth: %d, renderHight: %d", renderWidth, renderHeight);
    console.log("mouseX: %d, mouseY: %d", x, y);
    console.log("originX: %d, originY: %d, width: %d, height: %d", absoluteViewport.x, absoluteViewport.y, absoluteViewport.width, absoluteViewport.height);
    if (x > absoluteViewport.x && y1 > absoluteViewport.y) {
      if (x < absoluteViewport.x + absoluteViewport.width && y1 < absoluteViewport.y + absoluteViewport.height) {
        var pickinfo = scene.pick(x, y, function (mesh) { return mesh.name !== 'ground' }, undefined, c);
        if (pickinfo && pickinfo.hit) {
          cameraToPick = c
        }
      }
    }
  })
}

function getGroundPosition(evt: PointerInfo, scene: BabylonJSScene) {
  // Use a predicate to get position on the ground
  var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh.name === 'ground' }, undefined, cameraToPick)
  if (pickinfo && pickinfo.hit) {
    return pickinfo.pickedPoint
  }

  return null
}

function onPointerDown(evt: PointerInfo, scene: BabylonJSScene) {
  if (evt.event.button !==0) {
    return
  }

  setCameraToPick(scene)

  // check if we are under a mesh
  if (cameraToPick) {
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh.name !== 'ground' }, undefined, cameraToPick);
    if (pickInfo && pickInfo.hit) {
      currentMesh = pickInfo.pickedMesh;
      startingPoint = getGroundPosition(evt, scene);
      
      const canvas = scene.getEngine().getRenderingCanvas();
      if (startingPoint && canvas) { // we need to disconnect camera from canvas
        setTimeout(function () {
          scene.activeCameras.forEach(c => c.detachControl(canvas))
        }, 0)
      }
    }
  }
}

function onPointerUp(evt: PointerInfo, scene: BabylonJSScene) {
  const canvas = scene.getEngine().getRenderingCanvas()

  if (startingPoint && canvas) {
    scene.activeCameras.forEach(c => c.attachControl(canvas, true))
    startingPoint = null
    cameraToPick = undefined
  }
}

function onPointerMove(evt: PointerInfo, scene: BabylonJSScene) {
  if (!startingPoint) {
    return
  }

  var current = getGroundPosition(evt, scene)

  if (!current) {
    return
  }

  var diff = current.subtract(startingPoint)
  if (currentMesh) {
    currentMesh.position.addInPlace(diff)
  }

  startingPoint = current
}

function onSceneMount(e: SceneEventArgs) {
  const { canvas, scene } = e

	var camera1 = new ArcRotateCamera("camera1",  3 * Math.PI / 8, 3 * Math.PI / 8, 10, new Vector3(0, 1, 0), scene);
  camera1.attachControl(canvas, true);
  
  var camera2 = new ArcRotateCamera("camera2",  7 * Math.PI / 8, 7 * Math.PI / 8, 10, new Vector3(0, 1, 0), scene);
	camera2.attachControl(canvas, true);

  camera1.viewport = new Viewport(0, 0.5, 1, 0.5);
  camera2.viewport = new Viewport(0, 0, 1, 0.5);
    
  scene.activeCameras.push(camera1);
  scene.activeCameras.push(camera2);
  
  scene.getEngine().runRenderLoop(() => {
      if (scene) {
          scene.render();
      }
  });
}

const App: React.FC = () => {
  const EngineWithContext = withBabylonJS(Engine);

  const nbPoints = 30000;
  const points = new Array<CloudPoint>();
  for (let i = 0; i < nbPoints; i ++) {
    const x = Scalar.RandomRange(-100, 100);
    const y = Scalar.RandomRange(-100, 100);
    const z = Scalar.RandomRange(-100, 100);
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    const a = Scalar.RandomRange(0, 1);
    points.push(new CloudPoint(i, new Color4(r, g, b, a), new Vector3(x, y, z)));
  }

  const boxSize = 2;
  const faceColors = [
    Color4.FromColor3(Color3.Blue()),
    Color4.FromColor3(Color3.White()),
    Color4.FromColor3(Color3.Red()),
    Color4.FromColor3(Color3.Black()),
    Color4.FromColor3(Color3.Green()),
    Color4.FromColor3(Color3.Yellow())
  ]
  
  return (
    <div>
      <EngineWithContext antialias={false} adaptToDeviceRatio={true} canvasId="sample-canvas" engineOptions={{ stencil: true }} width={1280} height={720}>
        <Scene onSceneMount={onSceneMount} onScenePointerDown={onPointerDown} onScenePointerUp={onPointerUp} onScenePointerMove={onPointerMove}
          sceneOptions={{ useMaterialMeshMap: false }}>
          <hemisphericLight name="light1" intensity={0.7} direction={new Vector3(1, 0.5, 0)} />
          <hemisphericLight name="light2" intensity={0.8} direction={new Vector3(-1, 0.5, 0)} />
          <PointsCloud name={"sample-pcd"} scale={3} points={points} updatable={true} />
          <box name={"colored-box"} size={boxSize} position={Vector3.Zero()} faceColors={faceColors}>
            <standardMaterial name={"box-material"} />
          </box>
          <ground name='ground' width={200} height={200} subdivisions={1}>
            <standardMaterial name='groundMat' specularColor={Color3.Black()} />
          </ground>
        </Scene>
      </EngineWithContext>
    </div>
    
  );
}

export default App;
