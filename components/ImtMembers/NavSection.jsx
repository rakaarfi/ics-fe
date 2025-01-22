import Link from 'next/link';

export const NavSection = ({ title, data, boldItems }) => {
    return (
        <div className="flex flex-col">
            {title && <h1 className='text-base font-bold border-b font-jkt'>{title}</h1>}
            <div className='flex flex-col gap-2 my-1 border-b'>
                {data.map((item) => (
                    <Link
                        key={item.name}
                        href={item.link}
                        className={`font-jkt text-sm ${boldItems.includes(item.name) ? "font-bold" : ""}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};