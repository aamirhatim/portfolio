import { useState } from "react";
import CollectionManager, { FieldConfig } from "./CollectionManager";
import { CircleUserRound, PocketKnife, BriefcaseBusiness, Award, GraduationCap, FolderOpenDot, BadgeInfo } from "lucide-react";

const TAB_CONFIGS: Record<string, { title: string, icon: React.ReactNode, collections: { name: string, fields: FieldConfig[], disableAdd?: boolean }[] }> = {
    intro: {
        title: "Intro",
        icon: <BadgeInfo size={18} />,
        collections: [
            { name: "intro", disableAdd: true, fields: [{ name: "text", label: "Intro Text", type: "textarea" }] }
        ]
    },
    about: {
        title: "About Me",
        icon: <CircleUserRound size={18} />,
        collections: [
            { name: "aboutme", fields: [
                { name: "text", label: "Paragraph", type: "textarea" },
                { name: "order", label: "Order", type: "number" }
            ]}
        ]
    },
    skills: {
        title: "Skills",
        icon: <PocketKnife size={18} />,
        collections: [
            { name: "skills", fields: [
                { name: "name", label: "Skill Name", type: "string" },
                { name: "type", label: "Type", type: "string" },
                { name: "level", label: "Level (1-5)", type: "number" }
            ]}
        ]
    },
    jobs: {
        title: "Jobs",
        icon: <BriefcaseBusiness size={18} />,
        collections: [
            { name: "jobs", fields: [
                { name: "title", label: "Job Title", type: "string" },
                { name: "company", label: "Company", type: "string" },
                { name: "isCurrent", label: "Is Current?", type: "boolean" },
                { name: "start", label: "Start Date", type: "string" },
                { name: "end", label: "End Date", type: "string" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "detail", label: "Detail", type: "textarea" },
                { name: "skills", label: "Skills", type: "array" }
            ]}
        ]
    },
    patents: {
        title: "Patents",
        icon: <Award size={18} />,
        collections: [
            { name: "patents", fields: [
                { name: "title", label: "Title", type: "string" },
                { name: "status", label: "Status", type: "string" },
                { name: "year", label: "Year", type: "number" },
                { name: "number", label: "Patent Number", type: "string" },
                { name: "url", label: "URL", type: "string" },
                { name: "description", label: "Description", type: "textarea" }
            ]}
        ]
    },
    education: {
        title: "Education",
        icon: <GraduationCap size={18} />,
        collections: [
            { name: "education", fields: [
                { name: "school", label: "School", type: "string" },
                { name: "degree.short", label: "Degree (Short)", type: "string" },
                { name: "degree.long", label: "Degree (Long)", type: "string" },
                { name: "field", label: "Field of Study", type: "string" },
                { name: "start", label: "Start Year", type: "number" },
                { name: "end", label: "End Year", type: "number" }
            ]}
        ]
    },
    projects: {
        title: "Projects",
        icon: <FolderOpenDot size={18} />,
        collections: [
            { name: "projects", fields: [
                { name: "title", label: "Title", type: "string" },
                { name: "subtitle", label: "Subtitle", type: "string" },
                { name: "publishDate", label: "Publish Date (YYYY-MM-DD)", type: "string" },
                { name: "img", label: "Image Path", type: "string" },
                { name: "code", label: "Code URL", type: "string" },
                { name: "video", label: "Video URL", type: "string" },
                { name: "spotlight", label: "Spotlight?", type: "boolean" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "skills", label: "Skills", type: "array" }
            ]}
        ]
    }
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("intro");

    const tabs = Object.keys(TAB_CONFIGS).map(k => ({ id: k, label: TAB_CONFIGS[k].title, icon: TAB_CONFIGS[k].icon }));

    const currentConfig = TAB_CONFIGS[activeTab];

    return (
        <div className="flex h-full min-h-[70vh] px-4 pt-10">
            {/* Sidebar */}
            <div className="w-64 shrink-0 flex flex-col border-r border-[var(--border-color)] pr-4">
                <h2 className="text-2xl font-bold mb-6 text-[var(--txt-feature-color)]">Admin Portal</h2>
                <nav className="flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 text-left px-4 py-2 rounded transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? "bg-[var(--txt-highlight-color)] text-[var(--bg-color)]"
                                    : "text-[var(--txt-body-color)] hover:bg-[var(--bg-secondary-color)]"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col pl-8 overflow-y-auto pb-20">

                {/* Tab Content */}
                <div className="flex-1 flex flex-col gap-8">
                    {currentConfig.collections.map(c => (
                        <CollectionManager key={c.name} collectionName={c.name} fields={c.fields} disableAdd={c.disableAdd} />
                    ))}
                </div>
            </div>
        </div>
    );
}
