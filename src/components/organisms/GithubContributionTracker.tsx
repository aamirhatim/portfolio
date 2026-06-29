import { useEffect, useState } from "react";
import { GitHubContributionDay } from "../../data/datatypes";
import useIsMobile from "../../lib/hooks/useIsMobile";
import ArrowBtn from "../atoms/ArrowBtn";

const CACHE_KEY = "github_contributions_cache";
const CACHE_TIME_KEY = "github_contributions_cache_time";
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export default function GithubContributionTracker() {
    const [contributions, setContributions] = useState<GitHubContributionDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchContributions = async () => {
            try {
                // Check local storage cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
                const now = Date.now();

                if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < CACHE_DURATION_MS) {
                    const parsed = JSON.parse(cachedData) as GitHubContributionDay[];
                    if (active) {
                        setContributions(parsed);
                        setLoading(false);
                        return;
                    }
                }

                // If no cache or cache expired, fetch from API
                const response = await fetch("https://github-contributions-api.deno.dev/aamirhatim.json?flat=true");
                if (!response.ok) {
                    throw new Error("Failed to fetch contributions");
                }
                const data = await response.json();

                if (data && Array.isArray(data.contributions)) {
                    const contributionsList = data.contributions as GitHubContributionDay[];

                    // Save to cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify(contributionsList));
                    localStorage.setItem(CACHE_TIME_KEY, now.toString());

                    if (active) {
                        setContributions(contributionsList);
                        setLoading(false);
                    }
                } else {
                    throw new Error("Invalid data format received");
                }
            } catch (err) {
                console.error("Error loading GitHub contributions:", err);
                if (active) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchContributions();

        return () => {
            active = false;
        };
    }, []);

    // Helper to format date string as YYYY-MM-DD
    const formatDateString = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const isMobile = useIsMobile();

    // Calculate dates
    const today = new Date();
    const monthsToShow = isMobile ? 6 : 12;
    const startPeriodDate = new Date();
    startPeriodDate.setMonth(today.getMonth() - monthsToShow);

    // Adjust startPeriodDate to the preceding Sunday to align columns correctly
    const dayOfWeek = startPeriodDate.getDay();
    startPeriodDate.setDate(startPeriodDate.getDate() - dayOfWeek);

    const startPeriodDateStr = formatDateString(startPeriodDate);

    const filtered = contributions.filter(c => c.date >= startPeriodDateStr);

    const getLevelClass = (level: string) => {
        switch (level) {
            case "FIRST_QUARTILE":
                return "bg-(--color-accent-bg-subtle)";
            case "SECOND_QUARTILE":
                return "bg-(--color-accent-bg-muted)";
            case "THIRD_QUARTILE":
                return "bg-(--color-accent-bg-strong)";
            case "FOURTH_QUARTILE":
                return "bg-(--color-accent-bg-max)";
            case "NONE":
            default:
                return "bg-(--bg-secondary-color)";
        }
    };

    if (loading && !error) {
        return (
            <div className="w-full animate-pulse mb-8 select-none">
                <div className={`h-[75px] bg-(--bg-secondary-color) rounded-sm w-full ${isMobile ? 'max-w-[400px]' : 'max-w-[800px]'}`} />
            </div>
        );
    }

    if (error || (!loading && filtered.length === 0)) {
        return (
            <div className="w-full mb-8 select-none">
                <div className={`flex items-center justify-center h-[75px] border border-(--border-color) bg-(--bg-secondary-color)/30 rounded-sm w-full ${isMobile ? 'max-w-[400px]' : 'max-w-[800px]'}`}>
                    <span className="text-(--txt-subtitle-color) text-sm font-medium">Cannot fetch GitHub contributions</span>
                </div>
                {/* Bottom Row metadata & link */}
                <div className="flex mt-2 w-full">
                    <div className="w-full flex justify-between gap-2 text-(--txt-subtitle-color)">
                        <ArrowBtn text="See my work on GitHub" link="https://github.com/aamirhatim" />
                    </div>
                </div>
            </div>
        );
    }

    // Group display data into weeks
    const weeks: GitHubContributionDay[][] = [];
    let currentWeek: GitHubContributionDay[] = [];

    filtered.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Generate month labels: only output a label if the month changes in this column
    const monthLabels: string[] = weeks.map((week, idx) => {
        if (idx === 0) return ""; // Skip the very first column to avoid fragments
        
        const prevWeek = weeks[idx - 1];
        const currentMonth = new Date(week[0].date + "T00:00:00").toLocaleString("default", { month: "short" });
        const prevMonth = new Date(prevWeek[0].date + "T00:00:00").toLocaleString("default", { month: "short" });
        
        return currentMonth !== prevMonth ? currentMonth : "";
    });



    return (
        <div className="w-full mb-8 select-none">
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-(--border-color)">
                <div className={isMobile ? "max-w-[400px] min-w-[340px]" : "max-w-[800px] min-w-[700px]"}>
                    {/* Month labels grid */}
                    <div className="grid gap-[2px] text-[10px] text-(--txt-subtitle-color) mb-1 h-4 relative" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                        {monthLabels.map((label, idx) => (
                            <div key={idx} className="relative h-full">
                                {label && (
                                    <span className="absolute top-0 left-0 font-medium whitespace-nowrap">
                                        {label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Day contribution grid */}
                    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                        {weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="grid grid-rows-7 gap-[3px]">
                                {week.map((day) => (
                                    <div
                                        key={day.date}
                                        className={`w-full aspect-square rounded-xs transition-colors duration-200 ${getLevelClass(day.contributionLevel)}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row metadata & link */}
            <div className="flex mt-2 w-full">
                <div className="w-full flex justify-between gap-2 text-(--txt-subtitle-color)">
                    <ArrowBtn text="See my work on GitHub" link="https://github.com/aamirhatim" />
                </div>
            </div>
        </div>
    );
}
