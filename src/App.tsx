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
  StandardMaterial 
} from '@babylonjs/core';

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
  
	var light1 = new HemisphericLight("light1", new Vector3(1, 0.5, 0), scene);
	light1.intensity = 0.7;
	var light2 = new HemisphericLight("light2", new Vector3(-1, -0.5, 0), scene);
  light2.intensity = 0.8;
  
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
  return (
    <div>
      <EngineWithContext antialias={false} adaptToDeviceRatio={true} canvasId="sample-canvas" width={1280} height={720}>
        <Scene onSceneMount={onSceneMount}>
        </Scene>
      </EngineWithContext>
    </div>
    
  );
}

export default App;
