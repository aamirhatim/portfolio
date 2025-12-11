import { SkillType } from "../../data/datatypes"
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { useEffect, useState } from 'react'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import ChipGroup from "../molecules/ChipGroup"
import LazyImg from "../atoms/LazyImg"
import { orderBy } from "firebase/firestore"
import useIsMobile from "../hooks"
import { motion, Transition } from "motion/react"

export default function AboutPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [aboutTxt, setAboutTxt] = useState<string[]>([]);
    const [topSkills, setTopSkills] = useState<SkillType[]>([]);
    const [midSkills, setMidSkills] = useState<SkillType[]>([]);
    const [lowSkills, setLowSkills] = useState<SkillType[]>([]);

    // Animation config
    const transition:Transition = {
        duration: .3,
        type: "spring",
        bounce: .2,
    }

    // Get about me text
    useEffect(() => {
        const getAboutTxt = async () => {
            let aboutTxtRaw:string[] = [];
            const aboutDocs = await getDocumentsFromCollection(firebaseAppContext, "aboutme", [orderBy("order")]);
            aboutDocs?.forEach(doc => {
                aboutTxtRaw.push(doc.data.text);
            });
            setAboutTxt(aboutTxtRaw);
        };
        getAboutTxt();
    }, []);

    // Get skills
    useEffect( () => {
        const getSkills = async () => {
            const skills = await getDocumentsFromCollection(firebaseAppContext, "skills");

            // Categorize skills
            const tops:SkillType[] = [];
            const mids:SkillType[] = [];
            const lows:SkillType[] = [];
            skills?.map((skill) => {
                const data = skill.data as SkillType;
                if (data.level >= 4) {
                    tops.push(data);
                } else if (data.level >= 2) {
                    mids.push(data);
                } else {
                    lows.push(data);
                }
            });

            // Update lists
            setTopSkills(tops);
            setMidSkills(mids);
            setLowSkills(lows);
        };
        getSkills();
    }, []);

    return (
        <div className="px-4 flex flex-col gap-30">
            <section className={`mt-20 flex ${isMobile ? 'flex-col' : 'px-[10%] gap-15'}`}>
                <motion.div
                    className={`border rounded-md ${isMobile ? 'w-full h-90' : 'w-[35%] min-w-90 max-w-150 h-auto shrink-0'}`}
                    initial={{opacity: 0, x: -500}}
                    animate={{opacity: 1, x: 0}}
                    transition={transition}
                >
                    <LazyImg
                        imgPath="/aboutme.jpg"
                        className="h-full w-full"
                        placeholderPath="/thumbs/aboutme.jpg"
                        alt={"This is me"}
                    />
                </motion.div>
                
                <motion.div
                    className={`box-border p-4 flex flex-col gap-5 text-lg text-(--txt-feature-color)`}
                    initial={{opacity: 0, x: 500}}
                    animate={{opacity: 1, x: 0}}
                    transition={{...transition, delay: .1}}
                >
                    {aboutTxt.map((txt, key) => ( <p key={key}>{txt}</p> ))}
                </motion.div>
            </section>

            <motion.section
                className={`flex flex-col ${isMobile ? '' : 'max-w-[1000px] mx-auto'}`}
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: .25}}
                transition={{...transition, delay: .4}}
            >
                <div className="mb-10">
                    <div className='text-3xl font-bold mb-5'>I'm pretty good at</div>
                    <ChipGroup list={topSkills.map(i => i.name)} size="lg" />
                </div>

                <div className="mb-10">
                    <div className='text-3xl font-bold mb-5'>I'm familiar with</div>
                    <ChipGroup list={midSkills.map(i => i.name)} size="lg" />
                </div>

                <div className="mb-10">
                    <div className='text-3xl font-bold mb-5'>I've dabbled in</div>
                    <ChipGroup list={lowSkills.map(i => i.name)} size="lg" />
                </div>
            </motion.section>
        </div>
    )
}