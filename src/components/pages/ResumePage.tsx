import useIsMobile from "../../lib/hooks/useIsMobile"
import AnimateInView from "../atoms/AnimateInView"
import CurrentWork from "../molecules/currentWork"
import Patents from "../molecules/patents"
import PrevWork from "../molecules/prevWork"
import Schooling from "../molecules/schooling"
import Sprites from "../organisms/wallpapers/Sprites"

export default function ResumePage() {
    const isMobile = useIsMobile();

    return (
        <>
            <Sprites
                spriteCount={2}
                platformSelector="[data-sprite-platform='resume-divider']"
                spawnType="appear"
                showGroundLine={false}
                enableGroundPlatform={false}
                enableLedgeDrop={false}
                platformShiftChance={0}
                platformTopOffset={0}
                spawnDelay={300}
                randomizeSprites={true}
            />
            <section className={`flex flex-col gap-30 w-full px-4 ${isMobile ? '' : 'max-w-[800px] mx-auto'}`}>
                <AnimateInView><CurrentWork /></AnimateInView>
                <PrevWork />
                <Patents />
                <Schooling />
            </section>
        </>
    )
}