import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center py-5'>
      <div className='w-1/3 h-16 relative -my-3'>
        <Image
          src={"/mainlogo.png"}
          alt='collab-iq-logo'
          fill
          className='object-contain'
          priority
        />
      </div>
      <div className='w-2/3 flex justify-center items-center pt-5'>
        {children}
      </div>
    </div>
  );
};

export default layout;
