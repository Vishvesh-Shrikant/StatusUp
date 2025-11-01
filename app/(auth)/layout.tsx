import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='flex flex-col justify-center items-center w-full h-full'>
        <div className=' w-1/2 text-base text-center '>{children}</div>
      </div>
    </>
  );
};

export default layout;
