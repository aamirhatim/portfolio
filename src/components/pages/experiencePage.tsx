import CurrentWork from "../molecules/currentWork";
import Patents from "../molecules/patents";
import PrevWork from "../molecules/prevWork";
import Schooling from "../molecules/schooling";

export default function ExperiencePage() {
    return (
        <div className='flex flex-col gap-10'>
            <CurrentWork />
            <PrevWork />
            <Patents />
            <Schooling />
        </div>
    )
}