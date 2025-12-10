import useIsMobile from "../hooks"
import CurrentWork from "../molecules/currentWork"
import Patents from "../molecules/patents"
import PrevWork from "../molecules/prevWork"
import Schooling from "../molecules/schooling"

export default function ResumePage() {
    const isMobile = useIsMobile();

    return (
        <section className={`flex flex-col gap-30 w-full px-4 ${isMobile ? '' : 'max-w-[800px] mx-auto'}`}>
            <CurrentWork />
            <PrevWork />
            <Patents />
            <Schooling />
        </section>
    )
}