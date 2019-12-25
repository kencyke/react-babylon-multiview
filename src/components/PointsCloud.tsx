import React from 'react';
import { 
    StandardMaterial,
    Mesh,
    VertexData,
    Color3,
    Vector3,
    VertexBuffer,
    Color4,
    Vector2
} from "@babylonjs/core";
import { useBabylonScene } from 'react-babylonjs';

export class CloudPoint {
    public id: number = 0;
    public color: Color4 = new Color4(0, 0, 0, 1);
    public position: Vector3 = Vector3.Zero();
    public uv: Vector2 = new Vector2(0, 0);

    constructor(id: number, color: Color4, position: Vector3, uv?: Vector2) {
        this.id = id;
        this.color = color;
        this.position = position;
        if (uv) {
            this.uv = uv;
        }
    }
}

type PointsCloudProps = {
    name: string;
    scale: number;
    points: CloudPoint[];
    updatable?: boolean;
}

const PointsCloud: React.FC<PointsCloudProps> = (props: PointsCloudProps) => {
    const scene = useBabylonScene();

    var _positions = new Array<number>();
    var _colors = new Array<number>();
    var _uvs = new Array<number>();
    props.points.forEach((p: CloudPoint) => {
        _positions.push(p.position.x, p.position.y, p.position.z);
        _colors.push(p.color.r, p.color.g, p.color.b, p.color.a);
        _uvs.push(p.uv.x, p.uv.y);
    });
    
    var vertexData = new VertexData();
    vertexData.set(_positions, VertexBuffer.PositionKind)
    vertexData.set(_uvs, VertexBuffer.UVKind);
    vertexData.set(_colors, VertexBuffer.ColorKind);
    
    const mesh = new Mesh("points", scene);
    vertexData.applyToMesh(mesh, props.updatable);
    
    if (scene) {
        const material = new StandardMaterial("points cloud material", scene);
        material.emissiveColor = new Color3(1, 1, 1);
        material.disableLighting = true;
        material.pointsCloud = true;
        material.pointSize = props.scale;
        mesh.material = material;
    }

    return <mesh name={props.name} source={mesh}></mesh>
}

export default PointsCloud