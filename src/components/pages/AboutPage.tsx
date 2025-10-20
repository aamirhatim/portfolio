import { SkillType } from "../../data/datatypes"
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { useEffect, useState } from 'react'
import { getAllDocumentsFromCollection } from '../../lib/firestoreLib'
import ChipGroup from "../molecules/ChipGroup"

export default function AboutPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [topSkills, setTopSkills] = useState<SkillType[]>([]);
    const [midSkills, setMidSkills] = useState<SkillType[]>([]);
    const [lowSkills, setLowSkills] = useState<SkillType[]>([]);

    // Get skills
    useEffect( () => {
        const getSkills = async () => {
            const skills = await getAllDocumentsFromCollection(firebaseAppContext, "skills");

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
            <section>
                <div className='rounded-xl bg-amber-600 w-[30%] min-w-60 h-40'></div>
            </section>

            <section className='text-lg'>
                About me
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