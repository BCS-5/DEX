import Card from "./Card";
import cardData from "./data/cardData.json";

const CardSection = () => {
  return (
    <section className="max-w-[1080px] mx-auto">
      <ul className="mt-10 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
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