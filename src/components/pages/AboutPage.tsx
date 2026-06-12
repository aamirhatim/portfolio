import { SkillType } from "../../data/datatypes"
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { useEffect, useState, useMemo } from 'react'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import Chip from "../atoms/Chip"
import LazyImg from "../atoms/LazyImg"
import { orderBy } from "firebase/firestore"
import useIsMobile from "../../lib/hooks/useIsMobile"
import SocialsBar from "../molecules/socialsBar"

export default function AboutPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [aboutTxt, setAboutTxt] = useState<string[]>([]);
    const [skills, setSkills] = useState<SkillType[]>([]);

    // Get about me text
    useEffect(() => {
        let active = true;
        const getAboutTxt = async () => {
            const aboutTxtRaw: string[] = [];
            const aboutDocs = await getDocumentsFromCollection(firebaseAppContext, "aboutme", [orderBy("order")]);
            if (!active) return;
            aboutDocs?.forEach(doc => {
                aboutTxtRaw.push(doc.data.text);
            });
            setAboutTxt(aboutTxtRaw);
        };
        getAboutTxt();
        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    // Get skills
    useEffect(() => {
        let active = true;
        const getSkills = async () => {
            const skillsDocs = await getDocumentsFromCollection(firebaseAppContext, "skills");
            if (!active) return;
            const skillsList: SkillType[] = [];
            skillsDocs?.forEach((doc) => {
                skillsList.push(doc.data as SkillType);
            });
            setSkills(skillsList);
        };
        getSkills();
        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    const getSkillChipClasses = (level: number) => {
        if (level === 3) {
            return "bg-(--color-accent-bg-subtle) text-(--txt-body-color)";
        }
        if (level === 4) {
            return "bg-(--color-accent-bg-muted) text-(--txt-title-color) font-medium";
        }
        // Level 5 and above
        return "bg-(--color-accent-solid) text-(--bg-color) font-semibold";
    };

    const sortSkills = (list: SkillType[]) => {
        return [...list].sort((a, b) => {
            if (b.level !== a.level) {
                return b.level - a.level;
            }
            return a.name.localeCompare(b.name);
        });
    };

    const sortedCategorizedSkills = useMemo(() => {
        const filtered = skills.filter((skill) => skill.level >= 3);
        const code = filtered.filter((skill) => skill.type.toLowerCase() === "code");
        const tools = filtered.filter((skill) => skill.type.toLowerCase() === "tools");
        const concepts = filtered.filter((skill) => skill.type.toLowerCase() === "concepts");

        return {
            hasSkills: filtered.length > 0,
            columns: [
                { title: "code.", list: sortSkills(code) },
                { title: "tools.", list: sortSkills(tools) },
                { title: "concepts.", list: sortSkills(concepts) }
            ]
        };
    }, [skills]);

    return (
        <div className="px-4 flex flex-col gap-30">
            <section className={`mt-20 flex ${isMobile ? 'flex-col' : 'px-15 gap-10'}`}>
                <div
                    className={`rounded-md overflow-clip ${isMobile ? 'w-full h-90' : 'w-[35%] min-w-90 max-w-150 h-auto shrink-0'}`}
                >
                    <LazyImg
                        imgPath="/aboutme.jpg"
                        className="h-full w-full"
                        placeholderPath="/thumbs/aboutme.jpg"
                        alt={"This is me"}
                    />
                </div>

                <div
                    className={`box-border p-4 flex flex-col gap-5 text-lg text-(--txt-feature-color)`}
                >
                    {aboutTxt.map((txt, key) => (<p key={key}>{txt}</p>))}
                </div>
            </section>

            {sortedCategorizedSkills.hasSkills && (
                <section className={`px-4 ${isMobile ? '' : 'px-15'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {sortedCategorizedSkills.columns.map(({ title, list }) => (
                            <div key={title} className="flex flex-col gap-4">
                                <h3 className="title text-2xl text-(--txt-title-color) border-b border-(--border-color) pb-2 mb-2">
                                    {title}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {list.map((skill) => (
                                        <Chip
                                            key={skill.name}
                                            text={skill.name}
                                            size="md"
                                            classes={getSkillChipClasses(skill.level)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex justify-center w-full pb-10">
                <SocialsBar />
            </div>
        </div>
    )
}