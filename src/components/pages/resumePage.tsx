import CurrentWork from "../molecules/currentWork"
import Patents from "../molecules/patents"
import PrevWork from "../molecules/prevWork"
import Schooling from "../molecules/schooling"

export default function ResumePage() {
    return (
        <div className="flex flex-col gap-30 w-full">
            <CurrentWork />
            <PrevWork />
            <Patents />
            <Schooling />
        </div>
    )
}