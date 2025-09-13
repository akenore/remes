import Image from "next/image";

interface PageSectionProps {
  title?: string;
  paragraphs?: string[];
  imageSrcDesktop?: string;
  imageSrcMobile?: string;
  imageAlt?: string;
}

export default function PageSection({
  title = "",
  paragraphs = [
    "",
    "",
  ],
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
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className={`text-[1.3rem] text-center md:text-left text-gray ${
                idx === paragraphs.length - 1 ? "mb-10" : "mb-8"
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