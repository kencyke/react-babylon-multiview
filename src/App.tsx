import React from 'react';
import { Engine, Scene, withBabylonJS } from 'react-babylonjs'
import { Vector3 } from '@babylonjs/core';

const EngineWithContext = withBabylonJS(Engine);

const App: React.FC = () => {
  return (
    <div>
      <EngineWithContext antialias={false} adaptToDeviceRatio={true} canvasId="sample-canvas" width={1280} height={720}>
        <Scene>
          <freeCamera name="camera1" position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]} />
          <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
          <sphere name="sphere1" diameter={2} segments={16} position={new Vector3(0, 1, 0)} />
        </Scene>
      </EngineWithContext>
    </div>
    
  );
}

export default App;
