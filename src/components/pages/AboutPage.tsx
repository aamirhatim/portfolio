import { SkillType } from "../../data/datatypes"
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { useEffect, useState } from 'react'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import ChipGroup from "../molecules/ChipGroup"
import LazyImg from "../atoms/LazyImg"
import { orderBy } from "firebase/firestore"
import useIsMobile from "../hooks"

export default function AboutPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [aboutTxt, setAboutTxt] = useState<string[]>([]);
    const [topSkills, setTopSkills] = useState<SkillType[]>([]);
    const [midSkills, setMidSkills] = useState<SkillType[]>([]);
    const [lowSkills, setLowSkills] = useState<SkillType[]>([]);

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
        <div className="flex flex-col gap-20">
            <section className={`mt-20 flex ${isMobile ? 'p-4 flex-col' : 'relative'}`}>
                <LazyImg
                    imgPath="/aboutme.jpg"
                    className={`border rounded-md ${isMobile ? 'w-full h-90' : 'absolute right-[10%] -top-20 w-[40%] h-150'}`}
                    placeholderPath="/proj_thumbs/aboutme_thumb.jpg"
                    alt={"This is me"}
                />

                <div className={`box-border flex flex-col gap-5 text-lg text-(--txt-feature-color) ${isMobile ? 'p-6' : 'border border-l-0 w-[55%] p-10 pl-[8%] rounded-r-md bg-(--bg-secondary-color) z-1'}`}>
                    {aboutTxt.map((txt, key) => ( <div key={key}>{txt}</div> ))}
                </div>
            </section>

            <section className='flex flex-col px-4'>
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
            </section>
        </div>
    )
}