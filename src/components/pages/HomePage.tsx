import ProjectHighlight from "../molecules/projectHighlight"
import ArrowBtn from '../atoms/ArrowBtn'
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { useEffect, useState } from "react"
import { FirestoreDocType, ProjectType } from "../../data/datatypes"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { orderBy, where } from "firebase/firestore"
import useIsMobile from "../../lib/hooks/useIsMobile"
import Sprites from "../organisms/wallpapers/Sprites"
import HeroPhoto from "../molecules/HeroPhoto"
import WhatIDoSection from "../organisms/WhatIDoSection"
import GithubContributionTracker from "../organisms/GithubContributionTracker"
import SocialsBar from "../molecules/socialsBar"

export default function HomePage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [introTxt, setIntroTxt] = useState<string[]>([]);
    const [projSpotlightList, setProjSpotlightList] = useState<FirestoreDocType[]>([]);

    // Get intro and projects
    useEffect(() => {
        let active = true;

        getDocumentsFromCollection(firebaseAppContext, "intro").then((textDoc) => {
            if (!active) return;
            if (textDoc && textDoc.length > 0) {
                const text = textDoc[0].data.text as string;
                setIntroTxt(text.split(" "));
            }
        });

        const filter = [
            where("spotlight", "==", true),
            orderBy("publishDate", "desc")
        ];
        getDocumentsFromCollection(firebaseAppContext, "projects", filter).then((spotlights) => {
            if (!active) return;
            if (!spotlights) {
                setProjSpotlightList([]);
            } else {
                setProjSpotlightList(spotlights);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    return (
        <>
            <Sprites
                spriteCount={6}
                spawnDelay={800}
                enableGroundPlatform={true}
                showGroundLine={false}
                showPlatforms={false}
            />

            <div className="relative box-border flex flex-col w-full gap-12 md:gap-20 overflow-x-clip">
                {/* Hero Section: Intro text with square-cropped portrait positioned at bottom-right */}
                {introTxt.length > 0 && (
                    <div className="relative w-full">
                        <HeroPhoto data-sprite-platform isMobile={isMobile} />

                        <div
                            className={`box-border feature w-full flex flex-wrap content-start text-(--txt-feature-color) relative z-10 ${isMobile
                                ? 'mb-16 text-5xl px-4 gap-x-3 gap-y-2'
                                : 'mb-36 text-6xl pl-10 pr-[24%] gap-x-4 gap-y-6'
                                }`}
                        >
                            {introTxt.map((word, idx) => (
                                <div
                                    key={idx}
                                    className="h-min opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                                    style={{ animationDelay: `${idx * 0.03}s` }}
                                >
                                    {word}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Professional Expertise Section: What I Do */}
                <WhatIDoSection isMobile={isMobile} />

                {/* Featured Work Section */}
                {projSpotlightList.length > 0 && (
                    <section
                        className={`flex flex-col gap-4 ${isMobile ? 'px-4' : 'px-10'} opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]`}
                        style={{ animationDelay: '0.5s' }}
                    >
                        <h2 data-sprite-platform className="w-fit title text-3xl mb-4">Featured work</h2>

                        {projSpotlightList.map((p, idx) => (
                            <ProjectHighlight
                                key={idx}
                                project={{ id: p.id, ...p.data } as ProjectType}
                                idx={idx}
                            />
                        ))}

                        <div className="w-full flex text-lg">
                            <ArrowBtn text="See more" link="/projects" />
                        </div>
                    </section>
                )}

                {/* GitHub Contributions Grid */}
                <section
                    className={`w-full flex justify-center ${isMobile ? 'px-4' : 'px-10'}`}
                    aria-label="GitHub Contributions"
                >
                    <GithubContributionTracker />
                </section>

                {/* Socials Bar: Centered bottom */}
                <div className="flex justify-center w-full pt-4 pb-12">
                    <div data-sprite-platform className="w-fit"><SocialsBar /></div>
                </div>
            </div>
        </>
    );
}