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
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
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
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>
                {modalType === "edit" ? "Edit Job" : "Add Job"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 max-h-[60vh] overflow-y-auto'
              >
                <FormField
                  control={form.control}
                  name='companyName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter company name' />
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
                      <FormLabel>Role *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter role/position' />
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
                      <FormLabel>Priority *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className='w-full border border-input bg-background px-3 py-2 rounded-md'
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
                      <FormLabel>Date Applied</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          max={new Date().toISOString().split("T")[0]}
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
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='e.g., $80k - $100k' />
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='e.g., Remote, NYC' />
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
                      <FormLabel>Job Posting Link</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='https://example.com/job'
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
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder='Add any notes...'
                          className='w-full min-h-20 border border-input bg-background px-3 py-2 rounded-md'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className='pt-4'>
                  <DialogClose asChild>
                    <Button type='button' variant='outline'>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    className='text-background dark:text-foreground'
                  >
                    {modalType === "edit" ? "Save changes" : "Add Job"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>View Job Application</DialogTitle>
            </DialogHeader>

            <div className='space-y-4'>
              <div>
                <Label>Company Name</Label>
                <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                  {card?.companyName}
                </p>
              </div>

              <div>
                <Label>Role</Label>
                <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                  {card?.role}
                </p>
              </div>

              <div>
                <Label>Priority</Label>
                <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                  {card?.priority}
                </p>
              </div>

              <div>
                <Label>Date Applied</Label>
                <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                  {card?.dateApplied
                    ? format(new Date(card.dateApplied), "dd MMMM yyyy")
                    : "Not specified"}
                </p>
              </div>

              {card?.salaryRange && (
                <div>
                  <Label>Salary Range</Label>
                  <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                    {card.salaryRange}
                  </p>
                </div>
              )}

              {card?.location && (
                <div>
                  <Label>Location</Label>
                  <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                    {card.location}
                  </p>
                </div>
              )}

              {card?.link && (
                <div>
                  <Label>Job Posting Link</Label>
                  <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                    <a
                      href={card.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:underline'
                    >
                      {card.link}
                    </a>
                  </p>
                </div>
              )}

              <div>
                <Label>Notes</Label>
                <p className='border border-primary rounded-md p-2 text-foreground mt-1'>
                  {card?.notes ? card.notes : "No notes provided"}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default JobModal;
