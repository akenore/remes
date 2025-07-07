import Image from 'next/image';

interface EquipmentItem {
  image: string;
  designation: string;
  dayPrice: string;
  monthPrice: string;
}

// Temporary static data – will be replaced by API fetch later
const sampleData: EquipmentItem[] = [
  {
    image: '/home/bg-d-2.jpg',
    designation: 'Lit médicalisé électrique + matelas',
    dayPrice: '17,00€',
    monthPrice: '220,00€',
  },
  {
    image: '/home/bg-d-2.jpg',
    designation: 'Lit médicalisé électrique + matelas + table potence',
    dayPrice: '18,00€',
    monthPrice: '239,00€',
  },
];

export default function EquipmentTable() {
  return (
    <div className="overflow-x-auto mt-20">
      <table className="min-w-full border-[5px] border-white border-collapse text-left">
        <thead>
          <tr className="bg-blue text-white">
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">Image</th>
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">Désignation</th>
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">Jour*</th>
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">Mois*</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((item, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
            >
              <td className="px-6 py-4 border-[5px] border-white">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.designation}
                    fill
                    className="object-contain"
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-sm md:text-base border-[5px] border-white">
                {item.designation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base border-[5px] border-white">
                {item.dayPrice}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base border-[5px] border-white">
                {item.monthPrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 