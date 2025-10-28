import { SkillType } from "../../data/datatypes"
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { useEffect, useState } from 'react'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import ChipGroup from "../molecules/ChipGroup"
import LazyImg from "../atoms/LazyImg"
import { orderBy } from "firebase/firestore"

export default function AboutPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [aboutTxt, setAboutTxt] = useState<string[]>([]);
    const [topSkills, setTopSkills] = useState<SkillType[]>([]);
    const [midSkills, setMidSkills] = useState<SkillType[]>([]);
    const [lowSkills, setLowSkills] = useState<SkillType[]>([]);

    // Get about me text
    useEffect(() => {
        const getAboutTxt = async () => {
            let aboutTxtRaw:string[] = [];
            const aboutDocs = await getDocumentsFromCollection(firebaseAppContext, "aboutme", [orderBy("section")]);
            aboutDocs.forEach(doc => {
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
            skills.map((skill) => {
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
            <section className="box-border flex gap-10 w-full px-10">
                <div className="flex flex-col gap-5 grow-1 text-xl">
                    {aboutTxt.map((txt, key) => ( <div key={key}>{txt}</div> ))}
                </div>

                <LazyImg
                    imgPath="/aboutme.jpg"
                    className="rounded-xl w-100 h-150 border border-[var(--border-color)]"
                    placeholderPath="/proj_thumbs/aboutme.jpg"
                    alt={"This is me"}
                />
            </section>

            <section className='flex flex-col'>
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