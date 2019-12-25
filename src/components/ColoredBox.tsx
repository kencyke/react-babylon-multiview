import React from 'react';
import { Color4, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { useBabylonScene } from 'react-babylonjs';

type ColoredBoxProps = {
    name: string;
    size: number;
    color0: Color4;
    color1: Color4;
    color2: Color4;
    color3: Color4;
    color4: Color4;
    color5: Color4;
}

const ColoredBox: React.FC<ColoredBoxProps> = (props: ColoredBoxProps) => {
    const scene = useBabylonScene();

    const faceColors = [props.color0, props.color1, props.color2, props.color3, props.color4, props.color5];
    var box = MeshBuilder.CreateBox("box", { faceColors : faceColors, size : props.size }, scene);
    if (scene) {
        box.material = new StandardMaterial("box material", scene);
    }
    
    return <mesh name={props.name} source={box}></mesh>
}

export default ColoredBox