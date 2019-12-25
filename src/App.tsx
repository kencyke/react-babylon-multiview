import React from 'react';
import { Engine, Scene, SceneEventArgs, withBabylonJS } from 'react-babylonjs'
import { 
  Vector3,
  ArcRotateCamera,
  Viewport,
  HemisphericLight,
  MeshBuilder,
  Color3,
  Color4,
  StandardMaterial,
  Scalar
} from '@babylonjs/core';
import PointsCloud, { CloudPoint } from './components/PointsCloud';

const EngineWithContext = withBabylonJS(Engine);

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
  
  var faceColors = [];
	faceColors[0] = Color4.FromColor3(Color3.Blue());
	faceColors[1] = Color4.FromColor3(Color3.White());
	faceColors[2] = Color4.FromColor3(Color3.Red());
	faceColors[3] = Color4.FromColor3(Color3.Black());
	faceColors[4] = Color4.FromColor3(Color3.Green());
	faceColors[5] = Color4.FromColor3(Color3.Yellow());
 
	var box = MeshBuilder.CreateBox("box", { faceColors : faceColors, size : 2 }, scene);
  box.material = new StandardMaterial("", scene);
  
  scene.getEngine().runRenderLoop(() => {
      if (scene) {
          scene.render();
      }
  });
}

const App: React.FC = () => {
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
  return (
    <div>
      <EngineWithContext antialias={false} adaptToDeviceRatio={true} canvasId="sample-canvas" width={1280} height={720}>
        <Scene onSceneMount={onSceneMount}>
          <hemisphericLight name="light1" intensity={0.7} direction={new Vector3(1, 0.5, 0)} />
          <hemisphericLight name="light2" intensity={0.8} direction={new Vector3(-1, 0.5, 0)} />
          <PointsCloud name={"sample-pcd"} scale={3} points={points} updatable={true} />
        </Scene>
      </EngineWithContext>
    </div>
    
  );
}

export default App;
