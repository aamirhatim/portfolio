import useIsMobile from "./hooks/useIsMobile";

export const LinkRenderer = (props: { href?: string, children?: React.ReactNode }) => {
    return (
        <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
    );
};

export const BlockWrapper = ({ border, children }: { border?: boolean, children: React.ReactNode }) => {
    const isMobile = useIsMobile();
    if (border) {
        return (
            <div className="w-full flex justify-center my-6">
                <div className={`border border-(--border-color) rounded-xl p-6 ${isMobile ? 'w-full' : 'w-[80%]'}`}>
                    {children}
                </div>
            </div>
        );
    }
    return <div>{children}</div>;
};
