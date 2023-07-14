import { Environment } from "@react-three/drei";

export default function Lights()
{
    return <>
        
        <ambientLight intensity={ 0.6 } />
        <Environment preset="sunset"/>
    </>
}