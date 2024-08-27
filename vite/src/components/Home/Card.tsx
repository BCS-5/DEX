const Card = ({
  name,
  description,
  image,
}: {
  name: any;
  description: any;
  image: any;
}) => {
  return (
    <li className="pb-12 ">
      <img
        className="rounded-2xl"
        src={`/img/cardImg/${image}.jpg`}
        alt={name}
      />
      <h3 className="pt-5 text-white text-xl font-bold text-center">{name}</h3>
      <h5 className="pt-1 text-[#aaaaaa] text-md">{description}</h5>
    </li>
  );
};

export default Card;
