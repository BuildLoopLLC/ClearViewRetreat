import SubpageLayout from '@/components/ui/SubpageLayout'
import Image from 'next/image'

export default function GratitudePage() {
  return (
    <SubpageLayout
      title="With Gratitude"
      subtitle="Expressing our thanks to those who have supported our mission"
      breadcrumbs={[
        { name: 'About', href: '/about' },
        { name: 'With Gratitude', href: '/about/gratitude' }
      ]}
    >
      <div className="max-w-6xl mx-auto">
        {/* Introduction */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 md:p-12">
            <p className="text-xl md:text-2xl text-secondary-700 leading-relaxed mb-6">
              Many people and organizations have blessed us in this journey, and we would like to thank them for their encouragement, support, advice, and action on our behalf.
            </p>
            <div className="bg-white/80 rounded-2xl p-6 inline-block">
              <p className="text-lg md:text-xl text-secondary-800 italic font-semibold">
                **To those of you who have joined us in prayer and fasting, we can never say thank you enough for falling at the feet of the Lord on our behalf.**
              </p>
            </div>
          </div>
        </div>

        {/* Individual Supporters */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                Individual Supporters
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-3 md:gap-4 max-w-6xl mx-auto">
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Mark</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jim and staff</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <a href="http://sonrisemountainranch.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline font-medium">Matt and staff</a>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Chantal</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Anastasia</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Racquel</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Steven</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Shawn</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Barb</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Dario</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Scott</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Darby</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Sam</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Diana</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Nathan</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jay</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Lisa</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Michelle</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Neal</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Shelley</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kalynn</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jerry</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Charlene</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Bonni</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Chris</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Agnes</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rachelle</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Frances</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Joe</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Hunter</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kim</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Ken</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Benny and staff</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Larry</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Terri</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kennedy</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Chuck</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jordan</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rex</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">JohnMark</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Eli</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Thomas</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kelly</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Coy</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Tim</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Seth</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">G.G.</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rick</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Wilma</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Mark</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Debi</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Todd</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Joy</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Bete</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Luther</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kevin</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Sherry</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Michelle</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Steven</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">William</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Cyndy</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Brooke</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Deidra</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Delores</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Olivia</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Audra</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Tim</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rhett</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kevin</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Floyd</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Anita</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Wendell</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Tammy</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rena</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Bill</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Cheryl</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Daryl</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Gary</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Ken</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Danny</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Karen</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Brian</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Dennis</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jicey</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Frank</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Sarah</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Nina</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Ashley</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Reina</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Josh</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Dan</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Liz</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Mira</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Andrew</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Brooke</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Michelle</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rebekah</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Bailey</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kristi</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Scot</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Dana</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kristi</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jill</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Christina</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Haley</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <a href="http://lifepointchurch.org/smyrna" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline font-medium">LifePoint</a>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Rodney</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Karen</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jeff</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">David and son</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Brent</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Jennifer</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Scottie</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kristin</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">John</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Megan</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Matt</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Kevin</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Joe</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Lisa</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Andrea</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Paul</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Susan</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Tony</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Carla</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Tom</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Fred</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Robert</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Brandon</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Griffin</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">James</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Marie</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Madison</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Treva</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Robin</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Steven</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Summer</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Josh</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Lucas</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Nathaniel</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Micah and team</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">Don</span>
                </div>
                <div className="text-center p-1 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                  <span className="text-secondary-800 font-medium">George</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boy Scouts Section */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                THANK YOU TO THE BOY SCOUTS OF TROOP 374
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/images/Jacob-in-amphitheater.jpg"
                      alt="Jacob in amphitheater"
                      width={300}
                      height={169}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="text-center group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/images/Ben-Smith-and-Jacob-Nestle.jpg"
                      alt="Ben Smith and Jacob Nestle"
                      width={271}
                      height={300}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="text-center group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/images/Short-Bridge.jpg"
                      alt="Short Bridge"
                      width={300}
                      height={169}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Accord Section */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                THANK YOU TO THE <a href="https://globalaccordusa.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-200 hover:text-yellow-100 underline">GLOBAL ACCORD</a> TEAM
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="text-center">
                <div className="inline-block group">
                  <Image
                    src="/images/Composite-of-Before-During-After.png"
                    alt="Composite of Before During After"
                    width={899}
                    height={346}
                    className="rounded-2xl shadow-lg w-full max-w-4xl h-auto mx-auto transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Girl Scouts Section */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                THANK YOU TO THE YOUNG LADIES OF GIRL SCOUT TROOP 1367
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/images/Landscaping-work.jpg"
                      alt="The Girl Scouts cleaned up the leaves, weeds, and gravel, and gave us hardy plants and beautiful sustainable landscaping."
                      width={358}
                      height={209}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-sm text-secondary-600 mt-4 italic bg-secondary-50 rounded-lg p-3">
                    The Girl Scouts cleaned up the leaves, weeds, and gravel, and gave us hardy plants and beautiful sustainable landscaping.
                  </p>
                </div>
                <div className="text-center group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src="/images/Fire-pit-completed-day-of.jpg"
                      alt="As the stone settles in, a beautiful brick sitting area will be revealed!"
                      width={281}
                      height={211}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-sm text-secondary-600 mt-4 italic bg-secondary-50 rounded-lg p-3">
                    As the stone settles in, a beautiful brick sitting area will be revealed!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ministry Organizations */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                THANK YOU to these two organizations that have taught us so much about running the ministry:
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <a 
                  href="http://getfullyfunded.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                    <h4 className="text-xl md:text-2xl font-display font-semibold text-blue-700 group-hover:text-blue-800 transition-colors duration-200 mb-2">
                      Get Fully Funded
                    </h4>
                    <p className="text-blue-600 text-sm">Click to visit</p>
                  </div>
                </a>
                <a 
                  href="https://ministryventures.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center group"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
                    <h4 className="text-xl md:text-2xl font-display font-semibold text-indigo-700 group-hover:text-indigo-800 transition-colors duration-200 mb-2">
                      Ministry Ventures
                    </h4>
                    <p className="text-indigo-600 text-sm">Click to visit</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Advertising Sites */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                THANK YOU to these sites that allow us to advertise in order to reach more families:
              </h3>
            </div>
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <a 
                  href="http://christiancamppro.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center group"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                    <h4 className="text-lg font-display font-semibold text-orange-700 group-hover:text-orange-800 transition-colors duration-200">
                      Christian Camp Pro
                    </h4>
                  </div>
                </a>
                <a 
                  href="http://www.lawrencewilson.com/free-retreats-vacations-pastors/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center group"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                    <h4 className="text-lg font-display font-semibold text-orange-700 group-hover:text-orange-800 transition-colors duration-200">
                      Lawrence Wilson
                    </h4>
                  </div>
                </a>
                <a 
                  href="http://retreatfinder.com/ClearViewRetreat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center group"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                    <h4 className="text-lg font-display font-semibold text-orange-700 group-hover:text-orange-800 transition-colors duration-200">
                      Retreat Finder
                    </h4>
                  </div>
                </a>
              </div>
              
              <div className="text-center">
                <a 
                  href="http://www.BottRadioNetwork.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block group"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                    <Image
                      src="/images/Bott-Radio-Network-Nashville-Logo.jpeg"
                      alt="Bott Radio Network Nashville Logo"
                      width={300}
                      height={232}
                      className="rounded-xl shadow-lg mx-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </a>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-secondary-600 italic bg-secondary-50 rounded-lg p-4 inline-block">
                  (CVR does not monitor anything but its own listing and is not responsible for the other content of these sites.)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 rounded-3xl p-8 md:p-12 shadow-xl border border-primary-200">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-6">
              Join Our Community of Supporters
            </h3>
            <p className="text-secondary-700 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
              We're grateful for everyone who has supported our mission. Whether through prayer, 
              physical work, or financial support, every contribution helps us serve families better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                Get Involved
              </a>
              <a
                href="/about"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center hover:scale-105 transition-transform duration-200"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
