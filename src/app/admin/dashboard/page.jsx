import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      <h2>Ich bin das Admin-Dashboard</h2>

      <div className="flex flex-row justify-center gap-12 p-4">
        <Link href="/admin/manageEvents">
          <div className="flex flex-col items-center w-56 border border-foreground rounded-lg bg-gray-200 p-8 cursor-pointer hover:border-accent">
            <h3 className="mt-4 text-lg font-semibold truncate w-full text-center">
              Events
            </h3>
            <p className="text-lg font-bold mt-1">verwalten</p>
          </div>
        </Link>
        <Link href="/admin/manageEventCategories">
          <div className="flex flex-col items-center w-56 border border-foreground rounded-lg bg-gray-200 p-8 cursor-pointer hover:border-accent">
            <h3 className="mt-4 text-lg font-semibold truncate w-full text-center">
              Katgorie
            </h3>
            <p className="text-lg font-bold mt-1">verwalten</p>
          </div>
        </Link>
        <Link href="/admin/managePriceClasses">
          <div className="flex flex-col items-center w-56 border border-foreground rounded-lg bg-gray-200 p-8 cursor-pointer hover:border-accent">
            <h3 className="mt-4 text-lg font-semibold truncate w-full text-center">
              Preisklassen
            </h3>
            <p className="text-lg font-bold mt-1">verwalten</p>
          </div>
        </Link>
      </div>
      <div>
        <Link href="/admin/addEvents">
          <h5>Event erstellen</h5>
        </Link>
      </div>
      <div>
        <Link href="/admin/manageEventCategories">
          <h5>Kategorien verwalten</h5>
        </Link>
      </div>
      <div>
        <Link href="/admin/managePriceClasses">
          <h5>Preisklassen verwalten</h5>
        </Link>
      </div>
      <div>
        <Link href="/admin/manageEvents">
          <h5>Events verwalten</h5>
        </Link>
      </div>
    </>
  );
}
