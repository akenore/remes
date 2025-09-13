import Image from "next/image";

interface ListItem {
  text: string;
  subItems?: string[];
}

interface PageSectionProps {
  title?: string;
  paragraphs?: string[];
  lists?: ListItem[];
  afterParagraphs?: string[];
  imageSrcDesktop?: string;
  imageSrcMobile?: string;
  imageAlt?: string;
}

export default function PageSection({
  title = "",
  paragraphs = [],
  lists = [],
  afterParagraphs = [],
  imageSrcDesktop = "/adapted-r-desktop.jpg",
  imageSrcMobile = "/adapted-r-desktop.jpg",
  imageAlt = "Maison de Repos",
}: PageSectionProps) {
  return (
    <div className="mx-5 md:mx-auto max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="md:px-14">
          <h2 className="text-[1.5rem] md:text-[3.1rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
            {title}
          </h2>
          
          {/* Render paragraphs */}
          {paragraphs.map((p, idx) => (
            <p
              key={`paragraph-${idx}`}
              className={`text-[1.3rem] text-center md:text-left text-gray ${
                idx === paragraphs.length - 1 && lists.length === 0 && afterParagraphs.length === 0 ? "mb-10" : "mb-8"
              }`}
            >
              {p}
            </p>
          ))}
          
          {/* Render lists */}
          {lists.map((listItem, idx) => (
            <div key={`list-${idx}`} className="text-[1.3rem] text-center md:text-left text-gray mb-8">
              <ul>
                <li>
                  {listItem.text}
                  {listItem.subItems && listItem.subItems.length > 0 && (
                    <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                      {listItem.subItems.map((subItem, subIdx) => (
                        <li key={`sub-${idx}-${subIdx}`}>{subItem}</li>
                      ))}
                    </ol>
                  )}
                </li>
              </ul>
            </div>
          ))}
          
          {/* Render after paragraphs */}
          {afterParagraphs.map((p, idx) => (
            <p
              key={`after-paragraph-${idx}`}
              className={`text-[1.3rem] text-center md:text-left text-gray ${
                idx === afterParagraphs.length - 1 ? "mb-10" : "mb-8"
              }`}
            >
              {p}
            </p>
          ))}
        </div>
        <div>
          <Image
            src={imageSrcDesktop}
            alt={imageAlt}
            className="hidden md:block"
            width={610}
            height={648}
            style={{ width: "100%", height: "auto" }}
          />
          <Image
            src={imageSrcMobile}
            alt={imageAlt}
            className="block md:hidden"
            width={370}
            height={434}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}