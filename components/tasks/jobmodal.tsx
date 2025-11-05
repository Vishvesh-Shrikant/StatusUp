"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { JobType } from "@/types/types";
import { Priority } from "@/lib/constants";

const jobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  priority: z.string(),
  dateApplied: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const selected = new Date(val);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return selected <= now;
      },
      { message: "Application date cannot be in the future" }
    ),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  link: z.url("Must be a valid URL").optional().or(z.literal("")),
});

type JobFormData = z.infer<typeof jobSchema>;

interface Props {
  modalType: "view" | "edit" | "add";
  card: JobType | null;
  column: string | null;
  onClose: () => void;
}

const JobModal = ({ modalType, card, column, onClose }: Props) => {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyName: card?.companyName || "",
      role: card?.role || "",
      priority: (card?.priority as Priority) || Priority.MEDIUM,
      dateApplied: card?.dateApplied
        ? new Date(card.dateApplied).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      salaryRange: card?.salaryRange || "",
      location: card?.location || "",
      notes: card?.notes || "",
      link: card?.link || "",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    try {
      if (modalType === "add") {
        const newJob = {
          companyName: data.companyName,
          role: data.role,
          priority: data.priority,
          status: column,
          dateApplied: data.dateApplied || new Date().toISOString(),
          salaryRange: data.salaryRange,
          location: data.location,
          notes: data.notes,
          link: data.link,
        };

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newJob),
        });

        const result = await response.json();

        if (result.success) {
          toast.success("Job added successfully");
          onClose();
        } else {
          toast.error(result.error || "Error adding job");
        }
      }

      if (modalType === "edit" && card?._id) {
        const response = await fetch(`/api/jobs/${card._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          toast.success("Job updated successfully");
          onClose();
        } else {
          toast.error(result.error || "Error updating job");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    }
  };

  return (
    <>
      {modalType !== "view" ? (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>
                {modalType === "edit"
                  ? "Edit Job Application"
                  : "Add New Job Application"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5 max-h-[65vh] overflow-y-auto pr-2'
              >
                <FormField
                  control={form.control}
                  name='companyName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Company Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter company name'
                          className='focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Role *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter role/position'
                          className='focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Priority *
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className='w-full border border-input bg-background px-3 py-2 rounded-md focus:outline-none focus:border-foreground/50 transition-colors'
                        >
                          <option value={Priority.LOW}>Low</option>
                          <option value={Priority.MEDIUM}>Medium</option>
                          <option value={Priority.HIGH}>High</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dateApplied'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Date Applied
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          max={new Date().toISOString().split("T")[0]}
                          className='focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='salaryRange'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Salary Range
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g., $80k - $100k'
                          className='focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g., Remote, NYC'
                          className='focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='link'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Job Posting Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='https://example.com/job'
                          className='focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium'>
                        Notes
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder='Add any notes...'
                          className='w-full min-h-24 border border-input bg-background px-3 py-2 rounded-md focus:outline-none focus:border-foreground/50 transition-colors resize-none'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className='pt-4 gap-2'>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='min-w-[100px]'
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    className='text-background dark:text-foreground min-w-[100px]'
                  >
                    {modalType === "edit" ? "Save Changes" : "Add Job"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>
                Job Application Details
              </DialogTitle>
            </DialogHeader>

            <div className='space-y-4 max-h-[65vh] overflow-y-auto pr-2'>
              <div>
                <Label className='text-sm font-medium text-muted-foreground'>
                  Company Name
                </Label>
                <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 font-medium'>
                  {card?.companyName}
                </p>
              </div>

              <div>
                <Label className='text-sm font-medium text-muted-foreground'>
                  Role
                </Label>
                <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 font-medium'>
                  {card?.role}
                </p>
              </div>

              <div>
                <Label className='text-sm font-medium text-muted-foreground'>
                  Priority
                </Label>
                <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 font-medium capitalize'>
                  {card?.priority}
                </p>
              </div>

              <div>
                <Label className='text-sm font-medium text-muted-foreground'>
                  Date Applied
                </Label>
                <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 font-medium'>
                  {card?.dateApplied
                    ? format(new Date(card.dateApplied), "dd MMMM yyyy")
                    : "Not specified"}
                </p>
              </div>

              {card?.salaryRange && (
                <div>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Salary Range
                  </Label>
                  <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 font-medium'>
                    {card.salaryRange}
                  </p>
                </div>
              )}

              {card?.location && (
                <div>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Location
                  </Label>
                  <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 font-medium'>
                    {card.location}
                  </p>
                </div>
              )}

              {card?.link && (
                <div>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Job Posting Link
                  </Label>
                  <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5'>
                    <a
                      href={card.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 dark:text-blue-400 hover:underline break-all'
                    >
                      {card.link}
                    </a>
                  </p>
                </div>
              )}

              {card?.notes && (
                <div>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Notes
                  </Label>
                  <p className='bg-muted/50 rounded-md p-3 text-foreground mt-1.5 whitespace-pre-wrap'>
                    {card.notes}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className='pt-4'>
              <DialogClose asChild>
                <Button
                  variant='outline'
                  className='min-w-[100px] bg-primary! hover:bg-primary/80 text-white cursor-pointer'
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default JobModal;
