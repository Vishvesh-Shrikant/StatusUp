// "use client";
// import React, { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Button } from "../ui/button";
// import { Ellipsis, Pencil, Trash } from "lucide-react";
// import JobModal from "./jobmodal";
// import { JobType } from "@/types/types";

// interface Props {
//   card: JobType;
//   deleteJob: (id: string) => Promise<void>;
// }

// const JobDropdown = ({ card, deleteJob }: Props) => {
//   const [isEditing, setIsEditing] = useState(false);

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant={"ghost"} size='icon' className='cursor-pointer'>
//             <Ellipsis className='h-5 w-5' />
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent
//           className='w-48 rounded-xl border-2 bg-background dark:bg-background p-2 shadow-lg'
//           align='end'
//         >
//           <DropdownMenuItem
//             onClick={() => setIsEditing(true)}
//             className='cursor-pointer group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-white/40 dark:hover:bg-neutral-800'
//           >
//             <Pencil className='w-4 h-4' />
//             Edit
//           </DropdownMenuItem>

//           <DropdownMenuItem
//             onClick={() => deleteJob(card._id)}
//             className='cursor-pointer group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 dark:hover:bg-neutral-800 hover:bg-white/40 transition-colors'
//           >
//             <Trash className='text-red-500 w-4 h-4' />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Edit Modal outside dropdown */}
//       {isEditing && (
//         <JobModal
//           modalType='edit'
//           card={card}
//           column={card.status}
//           onClose={() => setIsEditing(false)}
//         />
//       )}
//     </>
//   );
// };

// export default JobDropdown;
"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import JobModal from "./jobmodal";
import { JobType } from "@/types/types";

interface Props {
  card: JobType;
  deleteJob: (id: string) => Promise<void>;
}

const JobDropdown = ({ card, deleteJob }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* ✅ use ghost variant instead of null to avoid style leaks */}
          <Button
            variant='ghost'
            size='icon'
            className='cursor-pointer hover:bg-white/40 dark:hover:bg-neutral-800 text-black!'
          >
            <Ellipsis className='h-5 w-5' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='w-48 rounded-xl border-2 bg-background dark:bg-background p-2 shadow-lg'
        >
          {/* ✅ EDIT item */}
          <DropdownMenuItem
            onClick={() => setIsEditing(true)}
            className='cursor-pointer group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-neutral-200! dark:hover:bg-neutral-800! transition-colors'
          >
            <Pencil className='w-4 h-4' />
            <span className='text-black'>Edit</span>
          </DropdownMenuItem>

          {/* ✅ DELETE item */}
          <DropdownMenuItem
            onClick={() => deleteJob(card._id)}
            className='cursor-pointer group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-neutral-200! dark:hover:bg-neutral-800! transition-colors'
          >
            <Trash className='text-red-500 w-4 h-4' />
            <span className='text-red-500'>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ✅ Edit modal outside dropdown */}
      {isEditing && (
        <JobModal
          modalType='edit'
          card={card}
          column={card.status}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default JobDropdown;
