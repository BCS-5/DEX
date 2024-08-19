import Card from "./Card";
import cardData from "./data/cardData.json";

const CardSection = () => {
  return (
    <section className="max-w-[1080px] mx-auto pt-[100px] pb-[60px] ">
      <div className="text-[25px] mb-4 font-bold text-center pb-[30px] ">
        장점
      </div>
      <ul className="mt-10 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-11 justify-items-center">
        {cardData?.map((v, i) => (
          <Card
            key={i}
            name={v.name}
            description={v.description}
            image={v.image}
          />
        ))}
      </ul>
    </section>
  );
};

export default CardSection;
