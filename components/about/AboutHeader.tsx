import { calendarDate } from "@/lib/about/util";
import { enrichTextContent } from "@/lib/util";

interface Props {
  title: string;
  description?: string;
  isIndex?: boolean;
  date: string;
}

const AboutHeader: React.FC<Props> = ({
  title,
  description,
  isIndex = false,
  date,
}) => {
  return (
    <>
      <h1
        className={`font-bold text-4xl ${
          isIndex ? "text-neutral-900" : "text-sky-900"
        } leading-relaxed`}
      >
        {title}
      </h1>
      <h3 className="text-2xl mt-1">{calendarDate(date)}</h3>
      {description && (
        <p
          className={`text-xl ${
            isIndex ? "text-neutral-700" : "text-sky-700"
          } opacity-80 mt-4`}
        >
          {enrichTextContent(description)}
        </p>
      )}
    </>
  );
};

export default AboutHeader;
