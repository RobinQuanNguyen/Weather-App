const Card = (props) => {
  const { content } = props;

  return <div className="card">{content}</div>; // The Card component will render a div with the text content passed in as a prop
};

export default Card;
