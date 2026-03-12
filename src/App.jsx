import React, { useState, useEffect } from 'react'

function QuoteForm({ variant, onSuccess }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!values.name.trim()) newErrors.name = 'Please complete this required field.'
    if (!values.email.trim()) newErrors.email = 'Please complete this required field.'
    if (!values.phone.trim()) newErrors.phone = 'Please complete this required field.'
    if (!values.details.trim()) newErrors.details = 'Please complete this required field.'

    if (Object.keys(newErrors).length > 0) {
      newErrors.form = 'Please complete all required fields.'
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || 'Failed to send quote request.')
        }
        setValues({
          name: '',
          email: '',
          phone: '',
          details: '',
        })
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'quote_form_sent', {
            event_category: 'engagement',
            event_label: 'Quote request submitted',
          })
          window.gtag('event', 'generate_lead', { currency: 'GBP' })
        }
        setIsSubmitting(false)
        if (onSuccess) onSuccess()
      })
      .catch((error) => {
        setErrors((prev) => ({
          ...prev,
          form:
            error.message ||
            'Sorry, something went wrong sending your request. Please try again.',
        }))
        setIsSubmitting(false)
      })
  }

  const baseInputClasses =
    'w-full border px-3 py-2 text-slate-900 outline-none ring-sky-500/40 focus:ring'
  const heroInputClasses =
    'rounded-sm border-slate-300 bg-white ' + baseInputClasses
  const bottomInputClasses =
    'rounded border-slate-300/80 bg-white/95 ' + baseInputClasses

  const inputClasses = variant === 'hero' ? heroInputClasses : bottomInputClasses

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs md:text-sm">
      <div>
        <label className="mb-1 block text-[11px] font-medium">
          Name<span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className={inputClasses}
        />
        {errors.name && (
          <p className="mt-1 text-[11px] text-red-300">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium">
          Email<span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className={inputClasses}
        />
        {errors.email && (
          <p className="mt-1 text-[11px] text-red-300">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium">
          Phone number<span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          className={inputClasses}
        />
        {errors.phone && (
          <p className="mt-1 text-[11px] text-red-300">{errors.phone}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium">
          Tell Us Your Case
        </label>
        <textarea
          name="details"
          value={values.details}
          onChange={handleChange}
          className={
            'min-h-[80px] w-full resize-y ' + inputClasses
          }
        />
        {errors.details && (
          <p className="mt-1 text-[11px] text-red-300">{errors.details}</p>
        )}
      </div>
      {errors.form && (
        <p className="text-[11px] text-red-300">{errors.form}</p>
      )}
      {errors.success && (
        <p className="text-[11px] text-emerald-300">{errors.success}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-2 w-full rounded px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white ${
          isSubmitting
            ? 'bg-slate-500 cursor-not-allowed'
            : 'bg-sky-700 hover:bg-sky-600'
        }`}
      >
        {isSubmitting ? 'Sending…' : 'Receive Free Quote'}
      </button>
    </form>
  )
}

const THANKS_PATH = '/thank-you'

function ThanksPage() {
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: THANKS_PATH,
        page_title: 'Thank You | Rosewood Investigations',
      })
      window.gtag('event', 'thanks_page_view', {
        event_category: 'conversion',
        event_label: 'Enquiry thank you page viewed',
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="bg-white text-slate-900 shadow">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-3 md:flex-row md:gap-3 md:py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="focus:outline-none">
              <img
                src="/logo.png"
                alt="Rosewood Investigations"
                className="h-10 w-auto"
              />
            </a>
          </div>
          <div className="flex flex-col items-stretch gap-2 text-xs md:flex-row md:items-center md:gap-4">
            <a
              href="tel:07407612398"
              className="rounded-full bg-[#0052cc] px-6 py-2 text-center text-xs font-semibold tracking-[0.25em] text-white hover:bg-[#0043a3]"
            >
              0740&nbsp;761&nbsp;2398
            </a>
            <a
              href="tel:07407612398"
              className="rounded-full bg-[#0052cc] px-6 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-white hover:bg-[#0043a3]"
            >
              CALL US TODAY FOR A FREE QUOTE
            </a>
          </div>
        </div>
      </header>

      {/* Main thank you content */}
      <main className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center px-4 py-16">
        <h1 className="text-center font-serif text-3xl font-bold uppercase tracking-wide text-[#8B2E2E] md:text-4xl">
          Thank you for your inquiry
        </h1>
        <div className="mt-16 flex flex-col items-center text-center">
          <a href="/" className="focus:outline-none">
            <img
              src="/logo.png"
              alt="Rosewood Investigations"
              className="h-12 w-auto"
            />
          </a>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-800">
            Rosewood Investigations
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            Units A–J Austen House, Station View,
            <br />
            Guildford, GU1 4AR
          </p>
          <p className="mt-3 text-xs text-slate-700">
            <a href="tel:07407612398" className="text-slate-900 no-underline hover:text-slate-700">
              Phone: 0740 761 2398
            </a>
            {' '}
            <span className="text-slate-400">Email:</span>{' '}
            <a href="mailto:private@rosewoodinvestigations.net" className="text-slate-900 no-underline hover:text-slate-700">
              private@rosewoodinvestigations.net
            </a>
          </p>
          <p className="mt-4 text-[11px] text-slate-500">
            © Copyright {new Date().getFullYear()} | All Rights Reserved
          </p>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="h-3 w-full bg-slate-200" aria-hidden />
    </div>
  )
}

const FAQ_ITEMS = [
  {
    question: 'How much does a private investigator cost?',
    content: (
      <>
        <p className="mb-3">
          If you're wondering how much does a private investigator cost, our
          private investigator prices are competitive, offering cheap private
          investigators near me without compromising quality.
        </p>
        <p>
          If you need to hire an investigator, whether for personal or legal
          matters, Rosewood Investigations is the name you can rely on. Contact
          us today to speak with a professional investigator.
        </p>
      </>
    ),
  },
]

function App() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const [path, setPath] = useState(
    () => (typeof window !== 'undefined' ? window.location.pathname : '/')
  )

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const goToThanks = () => {
    window.history.pushState({}, '', THANKS_PATH)
    setPath(THANKS_PATH)
  }

  if (path === THANKS_PATH) {
    return <ThanksPage />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header - full width */}
      <header className="bg-white text-slate-900 shadow">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-3 md:flex-row md:gap-3 md:py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="focus:outline-none">
              <img
                src="/logo.png"
                alt="Rosewood Investigations"
                className="h-10 w-auto"
              />
            </a>
          </div>
          <div className="flex flex-col items-stretch gap-2 text-xs md:flex-row md:items-center md:gap-4">
            <a
              href="tel:07407612398"
              className="rounded-full bg-[#0052cc] px-6 py-2 text-center text-xs font-semibold tracking-[0.25em] text-white hover:bg-[#0043a3]"
            >
              0740&nbsp;761&nbsp;2398
            </a>
            <a
              href="tel:07407612398"
              className="rounded-full bg-[#0052cc] px-6 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-white hover:bg-[#0043a3]"
            >
              CALL US TODAY FOR A
              <br />
              FREE QUOTE
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex min-h-[360px] max-w-6xl items-center px-4 py-10 lg:min-h-[420px] lg:py-14">
          {/* Hero content */}
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left text */}
            <div className="space-y-4 px-4 text-center md:px-0">
              <h1 className="hero-heading font-libre">
                Hiring A Private Investigator
                <br />
                You Can Trust Could Be
                <br />
                Cheaper Than You Think!
              </h1>
              <p className="text-lg text-sky-300 md:text-2xl">
                Book your 100% discreet consultation
              </p>
            </div>

            {/* Right form */}
            <div className="mt-6 w-full max-w-md justify-self-center lg:mt-0 lg:justify-self-end">
              <h2 className="text-center text-base font-semibold md:text-lg">
                Please Submit Your Details Below To Receive
                <br />
                Your Free Quote
              </h2>
              <QuoteForm variant="hero" onSuccess={goToThanks} />
            </div>
          </div>
        </div>
      </section>

      {/* About - map background */}
      <section
        className="relative text-slate-100"
        style={{
          backgroundImage: "url('/map.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto max-w-4xl px-4 py-10 text-center">
          <h2 className="text-3xl font-semibold text-sky-400">About Us</h2>
          <p className="mt-4 text-base leading-relaxed md:text-lg">
            Rosewood Investigations is a trusted private investigation agency
            offering a wide range of professional detective services to meet your
            needs. Whether you're looking for a private investigator near me,
            need help with a phone investigation, or require private
            surveillance, our team of experienced local private investigators
            is ready to assist. Whatever the case we can help.
          </p>
          <p className="mt-3 text-base leading-relaxed md:text-lg">
            We specialize in a variety of cases, including financial
            investigations, electronic harassment, and corporate
            investigations. Our detectives in London. Looking for a private
            detective or a digital private investigator? At Rosewood
            Investigations, we offer tailored solutions for everything from
            missing person cases to fraud investigations, and more.
          </p>
          <p className="mt-3 text-base leading-relaxed md:text-lg">
            Whether you're in need of a legal investigator, personal
            investigator, or online private investigators, we're here to help.
            Our team understands the importance of confidentiality, so you can
            trust us to handle your case with the utmost professionalism.
          </p>
          <p className="mt-3 text-base leading-relaxed md:text-lg">
            Rosewood we have the expertise to handle even the most complex
            situations. We are dedicated to providing you with reliable and
            100% confidential private investigation services.
          </p>
        </div>
      </section>

      {/* 3 Easy Steps banner */}
      <section className="steps-bar-bg py-4 text-center">
        <h2 className="text-3xl font-semibold text-slate-900">3 Easy Steps</h2>
      </section>

      {/* 3 Easy Steps - background image */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: "url('/3steps.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 text-center">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold">Step 1</h3>
              <p className="mt-3 text-base leading-relaxed">
                Complete the form above and submit to receive your free quote.
                All details provided remain 100% Confidential
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Step 2</h3>
              <p className="mt-3 text-base leading-relaxed">
                Discuss your tailored options with an experienced private
                investigator. Decide which option works best for your budget
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Step 3</h3>
              <p className="mt-3 text-base leading-relaxed">
                All evidence will be sent to your preferred contact method
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white py-12 text-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <article className="overflow-hidden rounded bg-slate-100 text-slate-900 shadow">
              <img
                src="/individual.jpg"
                alt="Individual investigations"
                className="h-64 w-full object-cover"
              />
              <div className="p-7 text-center">
                <h3 className="text-lg font-semibold">
                  Individual Investigations
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  Our team of highly skilled detectives is proficient in various
                  investigations, ranging from online dating inquiries to missing
                  person and matrimonial cases. You can rely on their expertise
                  to assist you effectively.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded bg-slate-100 text-slate-900 shadow">
              <img
                src="/covert.jpg"
                alt="Covert surveillance"
                className="h-64 w-full object-cover"
              />
              <div className="p-7 text-center">
                <h3 className="text-lg font-semibold">Covert Surveillance</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  Our team of skilled detectives, both female and male, will
                  provide you with essential photo and video evidence relevant to
                  your case.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded bg-slate-100 text-slate-900 shadow">
              <img
                src="/fraud.jpg"
                alt="Fraud investigations"
                className="h-64 w-full object-cover"
              />
              <div className="p-7 text-center">
                <h3 className="text-lg font-semibold">Fraud Investigation</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  The prevalence of online fraud in the UK results in significant
                  financial losses amounting to billions of pounds annually. If
                  you have been affected by online fraud, contact us without
                  delay for immediate assistance.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded bg-slate-100 text-slate-900 shadow">
              <img
                src="/missing.jpg"
                alt="Missing persons"
                className="h-64 w-full object-cover"
              />
              <div className="p-7 text-center">
                <h3 className="text-lg font-semibold">Missing Persons</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  In the UK, a person is reported missing every 90 seconds. With
                  the expertise of our professionals, we can aid you in tracing
                  individuals both within the country and internationally.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-white py-12 text-slate-900">
        <div className="mx-auto max-w-6xl w-full px-4 md:px-6 lg:px-8">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                className="border-b border-slate-200 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-900 text-white"
                    aria-hidden
                  >
                    {isOpen ? (
                      <span className="text-lg leading-none">−</span>
                    ) : (
                      <span className="text-lg leading-none">+</span>
                    )}
                  </span>
                  <span className="text-base font-medium md:text-lg">
                    {item.question}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 pb-5 pl-12 pr-4 pt-2 text-sm leading-relaxed text-slate-700 md:text-base">
                    {item.content}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom contact */}
      <section
        id="contact"
        className="relative py-10 text-white"
        style={{
          backgroundImage: "url('/contact-bottom.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-semibold">
            Please Submit Your Details Below To Receive Your Free Quote
          </h2>
          <div className="mx-auto mt-6 max-w-xl">
            <QuoteForm variant="bottom" onSuccess={goToThanks} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 text-xs text-slate-800">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <a href="/" className="inline-block focus:outline-none">
            <img
              src="/logo.png"
              alt="Rosewood Investigations"
              className="mx-auto h-10 w-auto"
            />
          </a>
          <p className="mt-4 font-semibold tracking-wide">
            ROSEWOOD INVESTIGATIONS.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed">
            Units A–J Austen House, Station View,
            <br />
            Guildford, GU1 4AR
          </p>
          <p className="mt-3 text-[11px]">
            <a href="tel:07407612398" className="text-slate-900 no-underline hover:text-slate-700">Phone: 0740 761 2398</a>
            {' '}&nbsp;|&nbsp;{' '}
            <a href="mailto:private@rosewoodinvestigations.net" className="text-slate-900 no-underline hover:text-slate-700">Email: private@rosewoodinvestigations.net</a>
          </p>
          <p className="mt-4 text-[11px] text-slate-500">
            © Copyright {new Date().getFullYear()} | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

