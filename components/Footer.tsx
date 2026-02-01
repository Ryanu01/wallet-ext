import Link from "next/link";

export function Footer  ()  {
  return (
    <section className="max-w-7xl mx-auto border-t px-4">
      <div className="flex justify-between py-8">
        <p className="text-primary tracking-tight">
            Developed by{" "}
          <Link target="_blank" href={"https://github.com/Ryanu01"} className="font-bold">
            Ryan
          </Link>
        </p>
      </div>
    </section>
  );
};
