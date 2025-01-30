import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <hr className="border-1 border-header p-2" />
      <Link href={"/impressum"} className="text-header">Impressum</Link>
    </>
  )
}
