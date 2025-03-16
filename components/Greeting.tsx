import React from "react";

interface GreetingProps {
  name?: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  const getGreeting = (): string => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <h1 className="text-4xl">
      {" "}
      {getGreeting()} {name}
    </h1>
  );
};

export default Greeting;
