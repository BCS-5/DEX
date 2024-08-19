const Card = ({
    name,
    description,
    image,
  }: {
    name: any;
    description: any;
    image: any;
  }) => {
    console.log(image);
  
    return (
      <li className="pb-12">
        <img
          className="rounded-xl"
          src={`/images/card/${image}.jpg`}
          alt={name}
        />
        <h3 className="pt-5 text-[#333333] text-xl font-bold">{name}</h3>
        <h5 className="pt-3 text-[#333333] text-md">{description}</h5>
      </li>
    );
  };
  
  export default Card;