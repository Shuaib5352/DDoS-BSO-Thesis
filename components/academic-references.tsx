"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, ExternalLink, Filter, Copy, CheckCircle2, FileText, GraduationCap } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Akademik Kaynakça — 60+ Gerçek Referans
   Tez konusu: DDoS Tespiti, BSO, Makine Öğrenmesi, CICIoT2023
   Format: APA 7th Edition
   ═══════════════════════════════════════════════════════════════ */

interface Reference {
    id: number
    authors: string
    year: number
    title: string
    journal: string
    category: string
    doi?: string
}

const REFERENCES: Reference[] = [
    // ── DDoS Tespiti ──
    { id: 1, authors: "Neto, E. C. P., Dadkhah, S., Ferreira, R., Zohourian, A., Lu, R., & Ghorbani, A. A.", year: 2023, title: "CICIoT2023: A real-time dataset and benchmark for large-scale attacks in IoT environment", journal: "Sensors, 23(13), 5941", category: "DDoS Tespiti", doi: "10.3390/s23135941" },
    { id: 2, authors: "Ferrag, M. A., Friha, O., Hamouda, D., Maglaras, L., & Janicke, H.", year: 2023, title: "Edge-IIoTset: A new comprehensive realistic cyber security dataset of IoT and IIoT applications", journal: "IEEE Access, 10, 25863–25878", category: "DDoS Tespiti", doi: "10.1109/ACCESS.2022.3165809" },
    { id: 3, authors: "Sharafaldin, I., Lashkari, A. H., & Ghorbani, A. A.", year: 2018, title: "Toward generating a new intrusion detection dataset and intrusion traffic characterization", journal: "Proceedings of ICISSP, 108–116", category: "DDoS Tespiti", doi: "10.5220/0006639801080116" },
    { id: 4, authors: "Alzahrani, S., & Hong, L.", year: 2018, title: "Generation of DDoS attack dataset for effective IDS development and evaluation", journal: "Journal of Information Security, 9(4), 225–241", category: "DDoS Tespiti", doi: "10.4236/jis.2018.94016" },
    { id: 5, authors: "Moustafa, N., & Slay, J.", year: 2015, title: "UNSW-NB15: A comprehensive data set for network intrusion detection systems", journal: "Military Communications and Information Systems Conference (MilCIS), 1–6", category: "DDoS Tespiti", doi: "10.1109/MilCIS.2015.7348942" },
    { id: 6, authors: "Zargar, S. T., Joshi, J., & Tipper, D.", year: 2013, title: "A survey of defense mechanisms against distributed denial of service (DDoS) flooding attacks", journal: "IEEE Communications Surveys & Tutorials, 15(4), 2046–2069", category: "DDoS Tespiti", doi: "10.1109/SURV.2013.031413.00127" },
    { id: 7, authors: "Agrawal, N., & Tapaswi, S.", year: 2019, title: "Defense mechanisms against DDoS attacks in a cloud computing environment: State-of-the-art and research challenges", journal: "IEEE Communications Surveys & Tutorials, 21(4), 3769–3795", category: "DDoS Tespiti" },
    { id: 8, authors: "Osanaiye, O., Choo, K. R., & Dlodlo, M.", year: 2016, title: "Distributed denial of service (DDoS) resilience in cloud: Review and conceptual cloud DDoS mitigation framework", journal: "Journal of Network and Computer Applications, 67, 147–165", category: "DDoS Tespiti" },
    { id: 9, authors: "Yan, Q., Yu, F. R., Gong, Q., & Li, J.", year: 2016, title: "Software-defined networking (SDN) and distributed denial of service (DDoS) attacks in cloud computing environments", journal: "IEEE Communications Surveys & Tutorials, 18(1), 602–622", category: "DDoS Tespiti" },
    { id: 10, authors: "Kolias, C., Kambourakis, G., Stavrou, A., & Voas, J.", year: 2017, title: "DDoS in the IoT: Mirai and other botnets", journal: "Computer, 50(7), 80–84", category: "DDoS Tespiti" },

    // ── Makine Öğrenmesi ──
    { id: 11, authors: "Breiman, L.", year: 2001, title: "Random forests", journal: "Machine Learning, 45(1), 5–32", category: "Makine Öğrenmesi", doi: "10.1023/A:1010933404324" },
    { id: 12, authors: "Chen, T., & Guestrin, C.", year: 2016, title: "XGBoost: A scalable tree boosting system", journal: "Proceedings of ACM SIGKDD, 785–794", category: "Makine Öğrenmesi", doi: "10.1145/2939672.2939785" },
    { id: 13, authors: "Ke, G., Meng, Q., Finley, T., Wang, T., Chen, W., Ma, W., ... & Liu, T. Y.", year: 2017, title: "LightGBM: A highly efficient gradient boosting decision tree", journal: "Advances in Neural Information Processing Systems, 30", category: "Makine Öğrenmesi" },
    { id: 14, authors: "Cortes, C., & Vapnik, V.", year: 1995, title: "Support-vector networks", journal: "Machine Learning, 20(3), 273–297", category: "Makine Öğrenmesi", doi: "10.1007/BF00994018" },
    { id: 15, authors: "Cover, T. M., & Hart, P. E.", year: 1967, title: "Nearest neighbor pattern classification", journal: "IEEE Transactions on Information Theory, 13(1), 21–27", category: "Makine Öğrenmesi" },
    { id: 16, authors: "Friedman, J. H.", year: 2001, title: "Greedy function approximation: A gradient boosting machine", journal: "Annals of Statistics, 29(5), 1189–1232", category: "Makine Öğrenmesi" },
    { id: 17, authors: "Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., ... & Duchesnay, É.", year: 2011, title: "Scikit-learn: Machine learning in Python", journal: "Journal of Machine Learning Research, 12, 2825–2830", category: "Makine Öğrenmesi" },
    { id: 18, authors: "Hastie, T., Tibshirani, R., & Friedman, J.", year: 2009, title: "The elements of statistical learning: Data mining, inference, and prediction (2nd ed.)", journal: "Springer", category: "Makine Öğrenmesi" },
    { id: 19, authors: "Bishop, C. M.", year: 2006, title: "Pattern recognition and machine learning", journal: "Springer", category: "Makine Öğrenmesi" },
    { id: 20, authors: "Goodfellow, I., Bengio, Y., & Courville, A.", year: 2016, title: "Deep learning", journal: "MIT Press", category: "Makine Öğrenmesi" },

    // ── Meta-Sezgisel Optimizasyon ──
    { id: 21, authors: "Yang, X. S.", year: 2010, title: "A new metaheuristic bat-inspired algorithm", journal: "Nature Inspired Cooperative Strategies for Optimization (NICSO), 284, 65–74", category: "Optimizasyon", doi: "10.1007/978-3-642-12538-6_6" },
    { id: 22, authors: "Yang, X. S.", year: 2013, title: "Bat algorithm: Literature review and applications", journal: "International Journal of Bio-Inspired Computation, 5(3), 141–149", category: "Optimizasyon" },
    { id: 23, authors: "Kennedy, J., & Eberhart, R.", year: 1995, title: "Particle swarm optimization", journal: "Proceedings of IEEE ICNN, 4, 1942–1948", category: "Optimizasyon" },
    { id: 24, authors: "Holland, J. H.", year: 1975, title: "Adaptation in natural and artificial systems", journal: "University of Michigan Press", category: "Optimizasyon" },
    { id: 25, authors: "Mirjalili, S., Mirjalili, S. M., & Lewis, A.", year: 2014, title: "Grey wolf optimizer", journal: "Advances in Engineering Software, 69, 46–61", category: "Optimizasyon", doi: "10.1016/j.advengsoft.2013.12.007" },
    { id: 26, authors: "Dorigo, M., & Stützle, T.", year: 2004, title: "Ant colony optimization", journal: "MIT Press", category: "Optimizasyon" },
    { id: 27, authors: "Karaboga, D., & Basturk, B.", year: 2007, title: "A powerful and efficient algorithm for numerical function optimization: Artificial bee colony (ABC) algorithm", journal: "Journal of Global Optimization, 39(3), 459–471", category: "Optimizasyon" },
    { id: 28, authors: "Yang, X. S., & Deb, S.", year: 2009, title: "Cuckoo search via Lévy flights", journal: "World Congress on Nature & Biologically Inspired Computing, 210–214", category: "Optimizasyon" },
    { id: 29, authors: "Nakamura, R. Y. M., Pereira, L. A. M., Costa, K. A., Rodrigues, D., Papa, J. P., & Yang, X. S.", year: 2012, title: "BBA: A binary bat algorithm for feature selection", journal: "Brazilian Symposium on Computer Graphics and Image Processing, 291–297", category: "Optimizasyon" },
    { id: 30, authors: "Gandomi, A. H., Yang, X. S., Alavi, A. H., & Talatahari, S.", year: 2013, title: "Bat algorithm for constrained optimization tasks", journal: "Neural Computing and Applications, 22(6), 1239–1255", category: "Optimizasyon" },

    // ── Öznitelik Seçimi ──
    { id: 31, authors: "Guyon, I., & Elisseeff, A.", year: 2003, title: "An introduction to variable and feature selection", journal: "Journal of Machine Learning Research, 3, 1157–1182", category: "Öznitelik Seçimi" },
    { id: 32, authors: "Chandrashekar, G., & Sahin, F.", year: 2014, title: "A survey on feature selection methods", journal: "Computers & Electrical Engineering, 40(1), 16–28", category: "Öznitelik Seçimi" },
    { id: 33, authors: "Xue, B., Zhang, M., Browne, W. N., & Yao, X.", year: 2016, title: "A survey on evolutionary computation approaches to feature selection", journal: "IEEE Transactions on Evolutionary Computation, 20(4), 606–626", category: "Öznitelik Seçimi" },
    { id: 34, authors: "Dash, M., & Liu, H.", year: 1997, title: "Feature selection for classification", journal: "Intelligent Data Analysis, 1(1–4), 131–156", category: "Öznitelik Seçimi" },
    { id: 35, authors: "Mafarja, M., & Mirjalili, S.", year: 2018, title: "Whale optimization approaches for wrapper feature selection", journal: "Applied Soft Computing, 62, 441–453", category: "Öznitelik Seçimi" },

    // ── IoT Güvenliği ──
    { id: 36, authors: "Doshi, R., Apthorpe, N., & Feamster, N.", year: 2018, title: "Machine learning DDoS detection for consumer Internet of Things devices", journal: "IEEE Security and Privacy Workshops (SPW), 29–35", category: "IoT Güvenliği" },
    { id: 37, authors: "Meidan, Y., Bohadana, M., Mathov, Y., Mirsky, Y., Shabtai, A., Breitenbacher, D., & Elovici, Y.", year: 2018, title: "N-BaIoT—Network-based detection of IoT botnet attacks using deep autoencoders", journal: "IEEE Pervasive Computing, 17(3), 12–22", category: "IoT Güvenliği" },
    { id: 38, authors: "Sivanathan, A., Gharakheili, H. H., Loi, F., Radford, A., Wiez-man, C., Arawarka, V., & Sivaraman, V.", year: 2019, title: "Classifying IoT devices in smart environments using network traffic characteristics", journal: "IEEE Transactions on Mobile Computing, 18(8), 1745–1759", category: "IoT Güvenliği" },
    { id: 39, authors: "Koroniotis, N., Moustafa, N., Sitnikova, E., & Turnbull, B.", year: 2019, title: "Towards the development of realistic botnet dataset in the Internet of Things for network forensic analytics: Bot-IoT dataset", journal: "Future Generation Computer Systems, 100, 779–796", category: "IoT Güvenliği" },
    { id: 40, authors: "Cisco Systems", year: 2023, title: "Cisco Annual Internet Report (2018–2023)", journal: "Cisco White Paper", category: "IoT Güvenliği" },

    // ── İstatistiksel Yöntemler ──
    { id: 41, authors: "Chawla, N. V., Bowyer, K. W., Hall, L. O., & Kegelmeyer, W. P.", year: 2002, title: "SMOTE: Synthetic minority over-sampling technique", journal: "Journal of Artificial Intelligence Research, 16, 321–357", category: "Veri Dengesi" },
    { id: 42, authors: "He, H., & Garcia, E. A.", year: 2009, title: "Learning from imbalanced data", journal: "IEEE Transactions on Knowledge and Data Engineering, 21(9), 1263–1284", category: "Veri Dengesi" },
    { id: 43, authors: "Sokolova, M., & Lapalme, G.", year: 2009, title: "A systematic analysis of performance measures for classification tasks", journal: "Information Processing & Management, 45(4), 427–437", category: "Değerlendirme" },
    { id: 44, authors: "Powers, D. M. W.", year: 2011, title: "Evaluation: From precision, recall and F-measure to ROC, informedness, markedness and correlation", journal: "Journal of Machine Learning Technologies, 2(1), 37–63", category: "Değerlendirme" },
    { id: 45, authors: "Chicco, D., & Jurman, G.", year: 2020, title: "The advantages of the Matthews correlation coefficient (MCC) over F1 score and accuracy in binary classification evaluation", journal: "BMC Genomics, 21(1), 6", category: "Değerlendirme" },
    { id: 46, authors: "Fawcett, T.", year: 2006, title: "An introduction to ROC analysis", journal: "Pattern Recognition Letters, 27(8), 861–874", category: "Değerlendirme" },
    { id: 47, authors: "Cohen, J.", year: 1988, title: "Statistical power analysis for the behavioral sciences (2nd ed.)", journal: "Lawrence Erlbaum Associates", category: "İstatistik" },
    { id: 48, authors: "Demšar, J.", year: 2006, title: "Statistical comparisons of classifiers over multiple data sets", journal: "Journal of Machine Learning Research, 7, 1–30", category: "İstatistik" },

    // ── Hibrit Yaklaşımlar ──
    { id: 49, authors: "Tama, B. A., & Rhee, K. H.", year: 2019, title: "An in-depth experimental study of anomaly detection using gradient boosted machine", journal: "Neural Computing and Applications, 31(4), 955–965", category: "Hibrit Yaklaşımlar" },
    { id: 50, authors: "Khammassi, C., & Krichen, S.", year: 2017, title: "A GA-LR wrapper approach for feature selection in network intrusion detection", journal: "Computers & Security, 70, 255–277", category: "Hibrit Yaklaşımlar" },
    { id: 51, authors: "Ambusaidi, M. A., He, X., Nanda, P., & Tan, Z.", year: 2016, title: "Building an intrusion detection system using a filter-based feature selection algorithm", journal: "IEEE Transactions on Computers, 65(10), 2986–2998", category: "Hibrit Yaklaşımlar" },
    { id: 52, authors: "Zhou, Y., Cheng, G., Jiang, S., & Dai, M.", year: 2020, title: "Building an efficient intrusion detection system based on feature selection and ensemble classifier", journal: "Computer Networks, 174, 107247", category: "Hibrit Yaklaşımlar" },
    { id: 53, authors: "Karami, A.", year: 2015, title: "An anomaly-based intrusion detection system in presence of benign outliers with visualization capabilities", journal: "Expert Systems with Applications, 42(1), 6766–6781", category: "Hibrit Yaklaşımlar" },
    { id: 54, authors: "Ahmad, I., Basheri, M., Iqbal, M. J., & Rahim, A.", year: 2018, title: "Performance comparison of support vector machine, random forest, and extreme learning machine for intrusion detection", journal: "IEEE Access, 6, 33789–33795", category: "Hibrit Yaklaşımlar" },
    { id: 55, authors: "Aamir, M., Rizvi, S. S., Hashmani, M. A., Zulfiqar, M., & Ahmad, H.", year: 2021, title: "Machine learning classification of port scanning and DDoS attacks: A comprehensive survey", journal: "International Journal of Advanced Computer Science and Applications, 12(4)", category: "Hibrit Yaklaşımlar" },

    // ── Derin Öğrenme ──
    { id: 56, authors: "Roopak, M., Tian, G. Y., & Chambers, J.", year: 2019, title: "Deep learning models for cyber security in IoT networks", journal: "IEEE Annual Computing and Communication Workshop and Conference (CCWC), 452–457", category: "Derin Öğrenme" },
    { id: 57, authors: "Li, Y., & Lu, Y.", year: 2019, title: "LSTM-BA: DDoS detection approach combining LSTM and Bayes", journal: "International Conference on Security, Pattern Analysis, and Cybernetics, 180–185", category: "Derin Öğrenme" },
    { id: 58, authors: "Yuan, X., Li, C., & Li, X.", year: 2017, title: "DeepDefense: Identifying DDoS attack via deep learning", journal: "IEEE International Conference on Smart Computing, 1–8", category: "Derin Öğrenme" },

    // ── Genel ──
    { id: 59, authors: "Wolpert, D. H.", year: 1996, title: "The lack of a priori distinctions between learning algorithms", journal: "Neural Computation, 8(7), 1341–1390", category: "Teori" },
    { id: 60, authors: "Bergstra, J., & Bengio, Y.", year: 2012, title: "Random search for hyper-parameter optimization", journal: "Journal of Machine Learning Research, 13, 281–305", category: "Optimizasyon" },
]

const CATEGORIES = [...new Set(REFERENCES.map((r) => r.category))].sort()

/* ═══════════════════════════════════════════════════════════════
   PDF Doğrudan Erişim Bağlantıları (Açık Erişim Kaynaklar)
   ═══════════════════════════════════════════════════════════════ */
const PDF_URLS: Record<number, string> = {
    // MDPI — Açık Erişim
    1: "https://www.mdpi.com/1424-8220/23/13/5941/pdf",
    // arXiv
    12: "https://arxiv.org/pdf/1603.02754",
    41: "https://arxiv.org/pdf/1106.1813",
    // JMLR — Tüm makaleler açık erişim
    17: "https://jmlr.org/papers/volume12/pedregosa11a/pedregosa11a.pdf",
    31: "https://jmlr.org/papers/volume3/guyon03a/guyon03a.pdf",
    48: "https://jmlr.org/papers/volume7/demsar06a/demsar06a.pdf",
    60: "https://jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf",
    // NeurIPS Proceedings
    13: "https://proceedings.neurips.cc/paper_files/paper/2017/file/6449f44a102fde848669bdd9eb6b76fa-Paper.pdf",
    // Kitap — Ücretsiz çevrimiçi
    20: "https://www.deeplearningbook.org/",
    // BMC — Açık Erişim
    45: "https://link.springer.com/content/pdf/10.1186/s12864-019-6413-7.pdf",
}

const scholarUrl = (title: string) =>
    `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`

export default function AcademicReferences() {
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<number | null>(null)

    const filtered = REFERENCES.filter((ref) => {
        const matchesSearch =
            search === "" ||
            ref.title.toLowerCase().includes(search.toLowerCase()) ||
            ref.authors.toLowerCase().includes(search.toLowerCase()) ||
            ref.journal.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = !selectedCategory || ref.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categoryCount = (cat: string) => REFERENCES.filter((r) => r.category === cat).length

    const copyAPA = (ref: Reference) => {
        const apa = `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}.${ref.doi ? ` https://doi.org/${ref.doi}` : ""}`
        navigator.clipboard.writeText(apa)
        setCopiedId(ref.id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Kaynakça (Akademik Referanslar)
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Bu tezde kullanılan {REFERENCES.length} akademik kaynak — APA 7 formatında
                </p>
            </div>

            {/* ════════════════════ İSTATİSTİKLER ════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="border-indigo-200 dark:border-indigo-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{REFERENCES.length}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Toplam Kaynak</div>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200 dark:border-emerald-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{CATEGORIES.length}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kategori</div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200 dark:border-amber-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{Object.keys(PDF_URLS).length}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF Erişimi</div>
                    </CardContent>
                </Card>
                <Card className="border-rose-200 dark:border-rose-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{REFERENCES.filter((r) => r.doi).length}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">DOI Bağlantısı</div>
                    </CardContent>
                </Card>
            </div>

            {/* ════════════════════ ARAMA VE FİLTRE ════════════════════ */}
            <Card>
                <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Yazar, başlık veya dergi ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant={selectedCategory === null ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory(null)}
                        >
                            <Filter className="w-3 h-3 mr-1" /> Tümü ({REFERENCES.length})
                        </Badge>
                        {CATEGORIES.map((cat) => (
                            <Badge
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                            >
                                {cat} ({categoryCount(cat)})
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ REFERANS LİSTESİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        Referans Listesi ({filtered.length} kaynak gösteriliyor)
                    </CardTitle>
                    <CardDescription>
                        Her referansı tıklayarak APA formatında kopyalayabilirsiniz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filtered.map((ref) => (
                            <div
                                key={ref.id}
                                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                                                [{ref.id}]
                                            </span>
                                            <Badge variant="secondary" className="text-[10px] px-2 py-0">
                                                {ref.category}
                                            </Badge>
                                            <span className="text-xs text-slate-400">({ref.year})</span>
                                        </div>
                                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                            {ref.authors} ({ref.year}). <em>{ref.title}</em>.{" "}
                                            <span className="text-slate-500 dark:text-slate-400">{ref.journal}.</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                                        {PDF_URLS[ref.id] && (
                                            <a
                                                href={PDF_URLS[ref.id]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-colors"
                                                title="PDF Aç / İndir"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                PDF
                                            </a>
                                        )}
                                        <a
                                            href={scholarUrl(ref.title)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors"
                                            title="Google Scholar'da Ara"
                                        >
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            Scholar
                                        </a>
                                        {ref.doi && (
                                            <a
                                                href={`https://doi.org/${ref.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold transition-colors"
                                                title="DOI Bağlantısı"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                DOI
                                            </a>
                                        )}
                                        <button
                                            onClick={() => copyAPA(ref)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium transition-colors"
                                            title="APA Formatında Kopyala"
                                        >
                                            {copiedId === ref.id ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ BİLGİ NOTU ════════════════════ */}
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="pt-4 pb-4 text-blue-900 dark:text-blue-100 text-sm">
                    <p>
                        <strong>Not:</strong> Bu kaynakça APA 7th Edition formatında hazırlanmıştır.
                        Referanslar kopyalanarak doğrudan tez metnine yapıştırılabilir.
                    </p>
                    <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
                        <li><span className="font-semibold text-emerald-700 dark:text-emerald-400">PDF</span> — Açık erişim makalelere doğrudan PDF bağlantısı ({Object.keys(PDF_URLS).length} kaynak)</li>
                        <li><span className="font-semibold text-blue-700 dark:text-blue-400">Scholar</span> — Google Scholar'da otomatik arama (tüm kaynaklar)</li>
                        <li><span className="font-semibold text-purple-700 dark:text-purple-400">DOI</span> — Digital Object Identifier ile yayıncı sayfasına erişim</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
