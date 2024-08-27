import Card from "./Card";
import cardData from "./data/cardData.json";
import cardData1 from "./data/cardData1.json";
import cardData2 from "./data/cardData2.json";
import useScrollFadeIn from "./ScrollEvent";

const CardSection = () => {
  // const fadeInFromLeft = useScrollFadeIn("left", 2, 0);
  const fadeInFromUp2 = useScrollFadeIn("up", 2, 0);
  const fadeInFromUp3 = useScrollFadeIn("up", 2, 0);
  const fadeInFromUp4 = useScrollFadeIn("up", 2, 0);

  return (
    <section className="max-w-[1080px] mx-auto pt-[100px] pb-[60px] ">
      {/* <ul className="mt-10 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-11 justify-items-center">*/}
      <div {...fadeInFromUp2}>
        <div
          className="text-[25px] mb-4 font-bold text-center pb-[30px] mx-[300px]"
          style={{
            background: "linear-gradient(to right, #FFB2D9, #A566Ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Advantages
        </div>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-11 justify-items-center ">
          {cardData?.map((v, i) => (
            <Card
              key={i}
              name={v.name}
              description={v.description}
              image={v.image}
            />
          ))}
        </ul>
      </div>
      <div {...fadeInFromUp3}>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-11 justify-items-center">
          {cardData1?.map((v, i) => (
            <Card
              key={i}
              name={v.name}
              description={v.description}
              image={v.image}
            />
          ))}
        </ul>
      </div>
      <div {...fadeInFromUp4}>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-11 justify-items-center">
          {cardData2?.map((v, i) => (
            <Card
              key={i}
              name={v.name}
              description={v.description}
              image={v.image}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CardSection;
