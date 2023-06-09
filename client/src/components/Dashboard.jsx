import { useSelector } from "react-redux";
import { Card } from "flowbite-react";
export const Dashboard = () => {
  const { currentUser, isLoading, error } = useSelector((state) => {
    return state.user;
  });

  return (
    <div className="text-gray-300 h-screen bg-darkBackground">
      the Current User is {JSON.stringify(currentUser, undefined, 2)}
      <div className="max-w-sm">
        <Card imgSrc="https://flowbite.com/docs/images/blog/image-1.jpg">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </Card>
      </div>
    </div>
  );
};
