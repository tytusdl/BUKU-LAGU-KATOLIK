export interface Song {
  id: string;
  title: string;
  lyrics: string;
  author?: string;
  songlabel?: string;
  image?: string;
  verified?: boolean;
  songNumber?: string;
}

import songsR from './songsR';

export const songs: Song[] = [
  {
    id: 'A1',
    title: 'NOKOIKOT ZIKOI NO',
    lyrics: `Nokoikot zikoi no
tumuubung Diau Tuhan
Miampai katangaban
Sabap do douso za

Chorus: Id surga tingadan
        Disontob tumongob
        Om mokiinsian ngaavi
        Do kinahasaan

Mokiinsian zikoi
Oi Ama id surga
Mantad koobian
Di Tanak Nu Jesus

Pokiinsianai zikoi
Oi Tina do Tuhan
Tuhungo no ngavi
Miampai sambayang nu

Insan tadau daa
Om kaamung zikoi no
Id kaa-sa-na-ngan
Doid surga togingo`,
    songNumber: 'A'
  },
  {
    id: 'A2',
    title: 'KANOU KUMAA ID TUHAN',
    lyrics: `Kanou kumaa id Tuhan
Kanou kumaa id Tuhan
Tadau diti kounsikaan
Kanou kumaa id Tuhan

Royoho tokou Tuhan
Royoho tokou Tuhan
Tadau diti kounsikaan
Royoho tokou Tuhan

Munsikou sawi-awi
Munsikou sawi-awi
Tadau diti kounsikaan
Munsikou sawi-awi

Tulungo yahai oi Tuhan
Tulungo yahai oi Tuhan
Tadau diti kounsikaan
Tulungo do guminawo`,
    songNumber: 'A'
  },
  {
    id: 'A3',
    title: 'SOMPOMOGUNAN HUMOZOU',
    lyrics: `Sompomogunan humozou
Miampai gizak do topuod
Papaazou do Kinoingan
Ii ikoton tokou baino

Iho'o no do Isido
I Tuhan om li Kuasa
Minamangun tokou ngaavi
Ii ikoton tokou baino

Pointahib kozo vinasi
Om nogi koginavaan Dau
Kosianan om katabazan
Doid dotokou tomo-imo`,
    songNumber: 'A'
  },
  {
    id: 'A4',
    title: 'KANOU MUNSIKOU',
    lyrics: `Kanou no kanou munsikou
Ontok ditti tadau tobitua
Ukabon noh ginawo tokou
Id Tuhan om id tiso om tiso

Chorus: Tuhan yahai monongkotoluod
        Sabap koginawaan nu dagai
        Tilombusan nu daa barakat nu
        Kanu zikoi no do mangarayou

Munsikou tokou sawi-awi
Lihwai ngaavi oh kosusaan
Tadau diti tadau kounsikaan
Tinahak do Tuhan dotokou

Id koposiyon tikid tadau
Kada tokou lihwai oh Tuhan
Onuai tokou Isio timpu
Do manahak do barakat Dau

Kanou no kanou munsikou
Munsikou tokou id Tuhan
Pibabasan om kounsikaan
Itti no daa iumon tokou.`,
    songNumber: 'A'
  },
  {
    id: 'A5',
    title: 'NOUNSIKOU ZOU',
    lyrics: `Ref:  Nounsikou zou songian noko-o-ngou
'Kanou mongoi tuubung do Tuhan'
Om baino, notimung zikoi no
Sumamba Diau, oi Tuhan Kinoingan

Kanou ngaavi, savi-avi kou
Sumodia doid kohubukan 'ti
Miampai do mangakun do douso
Om nogi do tumongob

Kanou no humuduk do Tuhan
Mimozo do ponuu-an ngaavi Dau
Id kahasa-an, kanou no mokiampun
Om kapadan di do momohubuk

Kada hivai ih boos di Jesus
'Pivasi po haid ngaavi di sontob
Kikousan om kihadangan Diau
Om vagu nogi do mikot.'`,
    songNumber: 'A'
  },
  {
    id: 'A6',
    title: 'KAAZAAN KINOINGAN',
    lyrics: `Kaazaan Kinoingan vozoon taazou
Diau b'lakat om kobontugan  
Id Diau no oh kapantangan 
Do so-u-mul – umul 
Kaazaan kobontugan id Diau 
Tu minamangun ko 
Do tavan om tana om sontob 
Ngaavi di vinangun Nu.

Notiitimung zikoi baino 
Miampai iso ginavo 
Papaabal do koginavaan 
Nu doid tanak Nu. 
Monginvagu do dandi za 
Do tumanud Diau 
Om nogi do guminavo 
Diau do tikid taau.

Ounsikou toomod izikoi
 Do nadadi do tanak Nu 
Tama ginovoon za 
Tama do tobinsianan
Mokiampun ngaavi do hasa 
Om mokianu nogi 
Do gra-si-a ih papavakas 
Do kotumbaa-za-an za.`,
    songNumber: 'A'
  },
  {
    id: 'A7',
    title: 'OUNSIKOU GINAVO',
    lyrics: `Ref:  Ounsikou ginavo za
Mikot id hamin Nu.

Koginavaan Nu id dagai 
Magangat savi-avi.... 
Doiho id Altari Nu... 
Popohubuk titaak za

Kanou papaazou Kinoingan 
Ih minonobus tokou....... 
Miampai do niawa om Zaa Dau 
Doiho id nuhu do Kalvary.

Kanou miampai di Jesus 
Momohubuk Disido.. 
'Sido sondii tuminaak 
Sabap no dotokou ngaavi.

Kobontugan doid Tama 
Om nogi di Tanak Jesus. 
Kampai nogi di Spiritu Sangti
S'lajul aiso kopupuson.`,
    songNumber: 'A'
  },
  {
    id: 'A8',
    title: 'YESUS KAMI DATANG PADAMU',
    lyrics: `Yesus kami datang padamu
Dengan hati kami terharu
Engkau ta'u kelemahan kami
Kami s'lalu jauh dariMu
Ampunilah kami ya Tuhan
Ampunilah kami ya Tuhan

Dalam hidup kami tiap hari
Kami s'lalu lupa padaMu
Kami keberatan godaan
Takut akan putus harapan
Kami doa SemangatMu
Kami doa SemangatMu

Doa kami padaMu Tuhan
Bawa kami s'lalu dekatMu
SalipMu kemenangan kami
KasihMulah harapan kami
Yesus engkau Hidup kami
Yesus engkau Hidup kami`,
    author: 'Fr. C . Piong',
    songNumber: 'A'
  },
  {
    id: 'A9',
    title: 'KANOU MUGAD SAMBAYANG',
    lyrics: `Kanou mugad sambayang
Ontok do hari minggu
Sumambut tokou do Tuhan
Tinan om zaa dau....(2x)

Tonudo tokou kaajalan
Mantad di Tuhan Jesus
Tuhun ngaavi do Kristian
Misti do sumambayang...(2x)

Pantango no ngaan do Tuhan
Ginovoon no tokou oh Tuhan
Ondomon no tokou Isido
Tikid-tikid tadau...(2x)`,
    author: 'Paul Kadau',
    songNumber: 'A'
  },
  {
    id: 'A10',
    title: 'SUMUKU TAKAU SUMBAYANG',
    lyrics: `Sumuku takau ngai-ngai
Paat ra orou raino
Sumuku takau sumambayang
Sumamba takau ra Tuhan

Pahaka kau nga-ngai
Trima kasih takau ra Tuhan
Orou gitu orou onnsoi
Tinaak mu Tuhan ri takau

Iningon dagu nu Tuhan
Atu pangajaran ritakau
Sukabin takau guang takau
Tuhan mayan ra guang takau

Paat ra Misa da raino
Sumimpung ih Jesus ritakau
Itakau ra sansulapan
Pagogondon guang takau

Sumambut takau ri Jesus
Ih Jesus noh Tuhan takau
Jesus akai percaya riyun
Okou noh kaharapan mai

Pahaka kau ngai Kristian
Onggoyo kajaran nu Tuhan
Onggoyo takau talanda
Pai gagayo guang noh`,
    author: 'Fr. C . Piong',
    songNumber: 'A'
  },
  {
    id: 'A11',
    title: 'YESUS MATONG AKAI DIUN',
    lyrics: `Yesus matong akai diun
Dengan guang mai-asusa
Koponong ko akai amungkang
Akai s'lalu kaa amaar-diun
Akiampun akai diun Tuhan
Akiampun akai diun Tuhan

Kayahan mai da tukir orou
Akai asalok kaliro diun
Akai ahatan panginaman
Alaa akai opopor diun
Akitaak akai kekuatan Mu
Akitaak akai kekuatan Mu

Akitaak akai diun Tuhan
Asiha akai amaar diun
Salip mu kemanangan mai
Okou yak guangon mai
Yesus Okou kayagan mai
Yesus Okou kayagan mai`,
    author: 'Fr. C . Piong',
    songNumber: 'A'
  },
  {
    id: 'A12',
    title: 'ALLELUIA',
    lyrics: `Datanglah, percayalah
Datang pada Tuhan yang hidup
Allelu, Allelu,
Alleluia, Yesus Kristus.

Carilah, dapatlah
Datang pada Tuhan yang hidup
Allelu, Allelu,
Alleluia, Yesus Kristus.

Dengarlah, fahamlah
Datang pada Tuhan yang hidup
Allelu, Allelu,
Alleluia, Yesus Kristus.`,
    songNumber: 'A'
  },
  {
    id: 'A13',
    title: 'POINTUBUNG DIAU OI TUHAN',
    lyrics: `Ounsikou ginavo
Notitimung do baino
Tumanud om umampai kohubukan Nu
Mokiampun do douso za
Papazou do ngaan Nu
Pointubung Diau oi Tuhan

Cho:  Pogozo kotumbazaan za
Doid Diau oi Tuhan
Tu izikoi tuhun do omungkang
Posodiao zikoi no
Monorimo barakat Nu
Pointubung Diau oi Tuhan

Koginavaan Nu dagai
Magangat savi-avi
Mamanau id binabang Nu oi Tuhan
Miiso id koginavaan Nu
Gisom do soumu-umul
Pointubung Diau oi Tuhan

Kotohuadan oi tuhan
Tu minomolohou dagai
Popointalang do kotumbayan dagai
Mantad baino oi Tuhan
Miiso id kotumbayan
Pointubung Diau oi Tuhan`,
    author: 'Belia St. Theresa Tambunan',
    songNumber: 'A'
  },
  {
    id: 'A14',
    title: 'KOBONTUGAN DOID TUHAN KINOINGAN',
    lyrics: `Chorus: Kobontugan doid kinoingan
Doid savat kozo

Om kababasan
Doid layat ngaavi Dau
Do doiti id tana (2x)

Oi Tuhan Kinoingan
Raja do surga
Kinoingan Tama
Vovozoon ngaavi

Sambaon za lziau
Monongkotohuad Diau
Pantangan za Iziau
Sabap kaazan Nu

Oi Jesus Kristus,
Tanak iso do Tama
Tuhan Kinoingan
Doumba do Kinoingan

Iziau mongidu
Douso do pomogunan
Kosianai dagai
Kosianai dagai

Iziau poindikau
Doid vanan do Tama
Toimoo pokionuon za
Mantad koginavaan Nu

Iziau no Tobitua
Iziau no Tuhan
Huguan za Tagazo
Oi Jesus Kristus

Oi Jesus Kristus
Om di Spritu Tobitua
Id kazaan
Do Kinoingan Tama.

A-A-Amen`,
    author: 'Fr. C. Piong',
    songNumber: 'A'
  },
  {
    id: 'A15',
    title: 'KANOU NGAAWI TUMIMUNG BAINO',
    lyrics: `Kanou ngaawi tumimung baino
Sabap kotumbayaan togirot id Tuhan
Kanou no ngaawi sumompuru
Do sumamba di Tuhan Kinoingan

Tuhan tudukai ikoi do ralan
Ralan katapatan om kotulidan
Do au daa kalawong ginawo ya
Pointanud di Tanak Nu Jesus

Karaja om tanggungan igitai no
Ingkaa no pointalang kotumbayaan
Id sambayang mokibarakat
Tuhan Kinoingan pokinsi-anan`,
    author: 'Belia Nambayan Tambunan',
    songNumber: 'A'
  },
  {
    id: 'A16',
    title: 'OI JESUS TUHAN RAJA KU',
    lyrics: `Oi Jesus, Tuhan Raja ku
Intaai izou doiti
Taakon ku id Ginavo Nu
Ginavo ku nodii
Tunduundu Nu oi Jesus ku,
Puun do koginavaan
Koizonon ku daa vague
Om au nodii zadaan

Sondii Ko nokoboos ingkaa
Di'd mokikia Nu
Nung taakon zu niawa daa
Sabap do koluang zu.
Pointahib koizo, kang ku daa,
Koginavaan diti,
Koginavaan Nu, Tuhan za,
Pointahib po ngaavi.

Nokopiuman Ko, Jesus ku,
Toluo au ountob
Om napatai id Salip Nu
Sabap dagai sontob
Om baino tumimpoon ko po
Di'd Sakramentum Nu
Papaakan Koduuduvo Ko
Do ngaavi tanak Nu`,
    songNumber: 'A'
  },
  {
    id: 'A17',
    title: 'KAMI DATANG BERSERU-SERU',
    lyrics: `Tuhan ku yang maha pengasih
Selalu bersamaku
Dalam godaan dan percobaan
Ku dipimpinNya s'lalu

Kor:  Kami datang berseru-seru,
Memuji NamaMu oh Tuhan
Kami bersyukur padaMu Tuhan
Oleh anugerahMu kami s'lamat

Betapa besar kasihMu Tuhan
Kepada umat manusia
AnakMu Yesus Engkau utuskan
Ke dunia memimpin kami

Rumput menghijau menjadi layu
Bumi akan binasa
Tetapi Tuhan dengan kuasaNya
Kekal dalam sepanjang abad

Terpujilah NamaMu Tuhan,
Di bumi dan di surga
Tiada dapat disangkal lagi,
Kerna kasih dan kuasanya`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'A'
  },
  {
    id: 'A18',
    title: 'SYUKURLAH PADAMU OH TUHAN',
    lyrics: `Tuhan Kau maha Agung
Pencipta alam maya
Penerang jalan hidup umat manusia

Kau pelindung hidupKu
Bila dalam kesukaran
Memberi kebahagia'an dijiwa

Kor:  Oh Tuhan ampunilah segala dosa kami
Dalam hidupku perlukan kasihMu
Pimpinilah tanganku
Kejalan Mu yang besar
Agar kami s'lalu disampingMu

Terpujilah NamaMu Tuhan
Di bumi dan di surga
Tiada dapat disangkal lagi
Kerna kasih dan kuasaNya.`,
    author: 'Belia St. Theresa Tambunan',
    songNumber: 'A'
  },
  {
    id: 'A19',
    title: 'TOVUD KOPOSIZON',
    lyrics: `Kanou savi-avi kanou ngavi mikot
Mikot toinsanan do papaazou
Iso kahansanan iso kotumbazaan
Mikot sumoomo Tovud Koposizon

Oikaristia Tovud Koposizon
Iho noh ih kinoikatan dotokou
Kanou savi-avi kanou intutunai
Tovud koposizon otoimo tokou

Ontok sodop 'Sido potobuso
Louti om Anggur naanu di Jesus
Dinadi Dau do Tinan om Zaa Dau
Takanon mindahan id kotumbazaan

Kanou monongkotohuod di Jesus
Miampai dotokou id Oikaristia
Maza Boos Dau om nogi Tinan Dau
Tovud Koposizon di ongotumbazaan

Monongkotohuod om posizo tokou
Ih tungkus di Jesus kumaa dotokou
Koponimpuuanan kumaa do vokon
Tu koginavaan tuva Oikaristia`,
    author: 'Fr. C. Piong',
    songNumber: 'A'
  },
  {
    id: 'A20',
    title: 'SAUDARA MARI SEMUA',
    lyrics: `Saudara mari semua,
memuji pada Tuhan
Bersama kita memuji,
Keagungan karyaNya

Kor:  Jangan coba lari dari hidup ini.
Hidup mu ini penuh erti
Yesus datang pada diri mu	)
Bukalah pintu hati mu		) 2x

Yesus menjadi rajamu,
benarlah, benarlah
Yesus bertakhta dihatimu,
benarlah, benarlah

Yesus dapat menghapus dosa,
benarlah, benarlah
Dengan darahNya yang tercurah,
benarlah, benarlah`,
    songNumber: 'A'
  },
  {
    id: 'A21',
    title: 'PENYESALAN',
    lyrics: `Tuhanku yang maha mulia,
ampunkanlah dosa ku
Kini aku sudah bertobat
Penuh dengan penyesalan

Kor:  Penyesalan...
Dihati ku tak terhingga
Kau berikanlah rahmat pengudus,
Kepada ku

Tuhan aku akan berjanji,
mencintaiMu selalu
Godaan jangan Kau biarkan
Jauhkan dari diri ku`,
    songNumber: 'A'
  },
  {
    id: 'A22',
    title: 'YUMIKOT ZIOY TUMUUBUNG DIAU TUHAN',
    lyrics: `Oy Tuhan Kinohoingan za
Yumikot zioy tumuubung Diau
Poinsavaton za ginavo
Kumaa Diau Tuhan za

Kor:  Onuai zioy do grasia Nu
Do kapadan Diau
Ompuno douso za Tuhan
Tomoimo do mipadan

Oy Jesus Tuhan Raja za
Itti pokionuon Diau
Posiizo ombiivo za
Do mipadan Diau

Harapon za Ziau Tuhan
Kosusui zioy do yahan Nu.
Posizo zioy Jesus Tuhan
Hiti id pomogunan

Ginavo Nu Jesus Tuhan
Osuibo om mouzuk
Umohigai, balakatai
Zioy do tikid tadau`,
    songNumber: 'A'
  },
  {
    id: 'A23',
    title: 'KANOU NOH MINSOMOK DOID TUHAN',
    lyrics: `Oi Tuhan.........
Nokoikot zikoi pointubung Diau
Do sumamba om mangazou Diau
Sundung potuu do omungkang izikoi
Poinghansan zikoi tomoimo doid Diau

Kor:  Kanou noh minsomok doid Tuhan )
Tu Isido Puun savi-avi kovosian	    ) 2x

Oi Tuhan………
Notimung izikoi noh doiti
Miampai do poingiso ginavo za
Mokinongou sontob kaajalanNu
Do kopisompuu d'izikoi id NgaanNu

Oi Tuhan.........
B'lakatai zikoi noh savi-avi
Kaanu di zikoi tumatap doid Diau
Doid kotumbazaan om kaharapan
Montok do koposizon za selajul`,
    author: 'Belia Beaufort',
    songNumber: 'A'
  },
  {
    id: 'A24',
    title: 'KAAZAN KUMMA DOID DIAU',
    lyrics: `Kobontugan doid Diau oi Tuhan
Kapantangan om kaazan
Tikid tadau koingat daa
Mangazou di ngaan Nu Tobitua

Cho:  Oi Tuhan Kinoingan za
Kaazan kumaa id Diau
Poi-soo zikoi no ngaavi
Id suang do koginavaanNu

Sompuu-vo zikoi no oi Tuhan
Doid iso kotumbazaan
Potuduko doid lahan totopot
Ih Jesus no monguhu dagai

Sokodungo guminavo Diau Tuhan
Tuhun nga poinsodia nogi
Guminavo do timbang – momogun
Kababasan pointatap adadi`,
    author: 'Belia St. Theresa Tambunan',
    songNumber: 'A'
  },
  {
    id: 'A25',
    title: 'POINGGAMUT ID POGIGION YA',
    lyrics: `Tuhan doiiti ikoi pointimung
Monongkotoluod ikoi Dika
Lumoyou id karayahan Nu
Tanda kounsikaan doid Dika

Iti no Habar Tosonong
Poinggamut id pogigion ya
Kakal po do popinghabaron
Kumaa doid tulun ngaawi

Kor:  Tulun di mogium Dika
Poinlansan nodii do apasi
Itti no Habar Tosonong
'Yoku noh waig di Kapasi'

Patahako no id dagai
Ih Spiritu do kabaranian
Papawakas do ginawo
Papahabar di Habar Nu`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'A'
  },
  {
    id: 'A26',
    title: 'BUKA HATIMU',
    lyrics: `Buka hatimu saudara
Tuhan mau berfimanlah
Jangan masuk di sengsara
T'rimalah dan simpanlah

Kor:  T'rima kasih, t'rima kasih
Ribu-Ribu kaliah
Kesempatan yang dikasih
Untuk t'rima berkatNya

Buanglah semua berhala
Dari dalam hatimu
Lebih baik Tuhan ada
Diam dalam hatimu`,
    songNumber: 'A'
  },
  {
    id: 'A27',
    title: 'SUMBER KEHIDUPAN',
    lyrics: `Mari semua marilah bersatu
Datang bersama untuk merayakan
Satu pengharapan satu kepercayaan
Datang kepada sumber kehidupan

Ekaristi Sumber Kehidupan
Itulah inti perayaan kita
Mari semua marilah kenali
Sumber kehidupan kita terima

Pada malam la diserahkan
Roti dan Anggur diambil olehNya
DijadikanNya Tubuh dan DarahNya
Santapan perjalanan iman kita

Pada Yesus marilah bersyukur
Bersama kita dalam Ekaristi
Kerna FimanNya dan juga TubuhNya
Sumber kehidupan bagi beriman

Mari bersyukur mari menghayati
Warisan Yesus bagi kita semua
Dalam pelayanan pada sesama
Cinta kasihlah hasil Ekaristi`,
    author: 'Fr. C. Piong',
    songNumber: 'A'
  },
  {
    id: 'A28',
    title: 'TIMPU DO SUMAMBAYANG',
    lyrics: `Iti noh timpu sumambayang
Poindoos tokou oh Tuhan
Poingkakat doid tanga tokou
Kanou noh sumamba do Tuhan

Cho:  Kounsikaan diau Tuhan
Doiti Ko id tanga dagai
Aazou noh oh ngaan Nu
Doid timpu diti

Iti noh timpu sumambayang
Poingongou tokou ih Tuhan
Sontob pokinsianan pobooso noh
Oonu pokionuon pointahango noh

Itti noh tim pu sumambayang
Monongkiboos tokou do Tuhan
Poisoo tokou oh ginavo
Kumaa doid Tuhan tokou

Itti noh timpu sumambayang
Poingintong tokou oh Tuhan
Ozoon tokou oh Tuhan
Pantango tokou oh Tuhan`,
    author: 'Catholic Youth Terawi',
    songNumber: 'A'
  },
  {
    id: 'A29',
    title: 'JESUS IH TUHAN ZA',
    lyrics: `Kobontugan doid diau Tuhan
Noponu ko do kaazaan
Aazou om apantang ko
Sabap iziau noh Tuhan za

Cho:  Jesus ih Tuhan za
Obitua oh ngaan nu
Iziau noh koposizon
Mantad baino om selajul

Kaazaan doid diau Tuhan
Raja do savi-avi Raja
Manaak ko do pibabasan
Poinggonop koginavaan nu.

Kounsikaan doid diau Tuhan
Lahan ko do katapatan
Iziau noh sambaon za
Ginovoon za soumu-umul`,
    author: 'Catholic Youth Terawi',
    songNumber: 'A'
  },
  {
    id: 'A30',
    title: 'MUNSIKOU OM MAMARAYOU',
    lyrics: `Ontok diti tadau Tobitua
Rumikot yahai doid Tuhan
Mamarayou gia ngaran Nu
Ii osundu om nogi abantug.

Ukabo no ginawo dahai
Kaanu yahai nodi koludukan
Mokinongou Boros Tobitua
Monorimo Oikaristia Tobitua.

Cho:Asanang ginawo dahai
Rumikot ngaawi doid Tuhan
Munsikou om mamarayou
Kalansanan doid koposion dahai

Iya noh karayahan dahai
Ii karati do suang ginawo
Om manahak gia koginawaan
Tu Iya noh guas koposian.`,
    author: 'Fr. Peter Abes',
    songNumber: 'A'
  },
  {
    id: 'A31',
    title: 'MARI KITA BERSUKARIA',
    lyrics: `Mari kita bersukaria
Kerna ini hari bahagia
Kita berkumpul jadi satu
Puji Tuhan semesta itu
Lupakanlah hati yang sedih
Bukankah Yesus berkata,
Damai yang dib'rikan kita,
Mari kita bersukaria.`,
    songNumber: 'A'
  },
  {
    id: 'A32',
    title: 'KITA BERTEMU',
    lyrics: `Kita betemu 'tuk menyembah Tuhan
Kita bertemu saling mengasihi
Kita bertemu saling menyembuhkan
Puji Dia……. puji halleluia
Puji namaNya`,
    songNumber: 'A'
  },
  {
    id: 'B1',
    title: 'PIBABASAN TAAKO',
    lyrics: `Cho: Pibabasan taako dagai Tuhan
Pibabasan mantad doid Diau
Tuhungo no popokito diti
Doid koimaan om k'laja
Ngaavi dagai

Mimang ko daa dagai
Do koiso id Diau
Om mimang ngaavi do kalaja Nu
Tuhungo zikoi no, do guminavo
Do songovian tuhun sabap Diau

Sundung au mipadan
Dinadi zikoi Diau
Do tanak sumuupu doid Diau
Tuhungo zikoi no, Tuhan Kinoingan
Popobuu do kababasan Nu`,
    songNumber: 'B'
  },
  {
    id: 'B2',
    title: 'OI TUHAN, POBOOS NO',
    lyrics: `Oi Tuhan, poboos no
Poi-ngo-ngou i-zikoi
Poboos no, om kosimban di
Pomu-gi-na-van za ngaavi`,
    songNumber: 'B'
  },
  {
    id: 'B2a',
    title: 'POZOO KINOINGAN',
    lyrics: `Chorus: Pozoo Kinoingan
Hozou kaazan Dau
Oinsasanan tokou
Mogi-a-am-pot

Tu vinangun tokou Dau
Om di-na-di
Do tanak Dau sondi-i
Ih koginavaan

Tu pinotohuod Dau
Tanak Dau Sondi
Ih Jesus mononobus
Do-id dotokou

Kobontugan do Tama
Om do Tanak
Om di Spiritu Sangti
Baino om to-moi-mo`,
    songNumber: 'B'
  },
  {
    id: 'B3',
    title: 'KANOU HUMOZOU',
    lyrics: `Munsikou tokou ngaavi
Humozou hozou kobontugan
Tikid tadau ingkaa daa ngaavi

Chorus: Kanou humozou
Doid Ka-a-za-an
Papazou do Tuhan za
Ih Kinoingan om Raja

Kinoingan za om Tama
Kikuasa ko doid raja ngaavi
Tudukai no id katapatan

Kounsikaan doid Tuhan
Poingamung id paganakan dau
Ih totuvong noonuan ninavau`,
    songNumber: 'B'
  },
  {
    id: 'B4',
    title: 'ROYOHO TUHAN',
    lyrics: `Chorus: Kanou no royoho
Poroyoho Tuhan
Kanou no royoho
Tuhan Ih ki-kuasa

Koginawan Doid pinopiiso dotokou
Mantad do douso
Tuhan no ih pinapaampun

Kristus Tuhan, koluang do tavasi;
Ih kaanu popoinsodu
Koimbayatan ngaawi`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'B'
  },
  {
    id: 'B5',
    title: 'TONUDO TOKOU TUHAN',
    lyrics: `Kinoingan no Ih Tama tokou
Tama tokou di tosonong
Kanou toin-sanan tonudo tokou – no daa
Yadaai ngaawi ih taraat

Kanou ngaawi ingato tokou
Soroho no ih boros do Tuhan;
Posuango id ginawo tokou – no daa
Om kaanu mai koposiyon selajur

Kotumbaa-yan igitan tokou,
Tonudo no ih ponuhuan do Tuhan;
Katapatan gompiyo tokou – no daa
Om saa-wia-wi ko-pi-ulud dii.`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'B'
  },
  {
    id: 'B6',
    title: 'JESUS, OI RAJA ZA',
    lyrics: `Jesus, oi Raja za
Kaazaan om gloria diau kakaal
Tu id ginavo Nu
Ngaavi zikoi kaanu
Titaak Nu tosundu, koginavaan

Jesus suang no daa
Ngaavi ginavo za do izonon
Pomorinta dagai
Jesus ada zadaai
Gisom do apatai zikoi touvi`,
    songNumber: 'B'
  },
  {
    id: 'B7a',
    title: 'INJIL IALAH KASIH ALLAH',
    lyrics: `Injil ialah Kasih Allah
Injil ialah Kasih Alah
Injil nyatakan KebenaranNya
Injil itu Yesus Kristus
(Ulangi)

Alleluia, Alleluia
Alleluia, Alleluia
Alleluia, Alleluia, I
Injil itu Yesus Kristus
(Ulangi)`,
    songNumber: 'B'
  },
  {
    id: 'B7b',
    title: 'SABDAMU MEMBIMBING KAMI',
    lyrics: `Ya Tuhan kami bersyukur
SabdaMu membimbing kami
Engkaulah jalan kebenaran
Ya Tuhan kami bersyukur

Ya Tuhan kami gembira
Menerima KhabarMu Tuhan
Engkaulah Jurus'lamat kami
Ya Tuhan kami gembira

Ya Tuhan kami berdoa
Berikanlah kepercayaan
Engkaulah Sabda kehidupan
Ya Tuhan kami berdoa

Ya Tuhan kami percaya
Mengikuti semua p'rintahMu
Engkaulah suluh kehidupan
Ya Tuhan kami percaya`,
    author: 'Belia Bundu Kuala Penyu',
    songNumber: 'B'
  },
  {
    id: 'B8',
    title: 'SABDAKAN TUHAN',
    lyrics: `Sabdakan Tuhan, FimanMu padaku
FirmanMu pelita hidupku
Hancurkan Tuhan kelalaian hidupku
Menerima berita FimanMu

Kor: Hanyalah Tuhan pancaran hidupku
FirmanMu suci merobah hidupku
FirmanMu Tuhan, Fiman yang hidup
FirmanMu Tuhan, Fiman yang hidup

Hanyalah Tuhan ku yakin janjiMu
Keselamatan hidupku padaMu
Hanyalah Tuhan ku yakin janjiMu
Keselamatan hidupku padaMu`,
    songNumber: 'B'
  },
  {
    id: 'B9a',
    title: 'KU PERLU TUHAN',
    lyrics: `Ku perlu Tuhan dalam hidupku
Ku perlu Tuhan setiap waktu
Senang dan susah ku perlu Tuhan
Ku perlu Tuhan selamanya

Ku perlu Tuhan dalam hidupku
Ku perlu Tuhan setiap waktu
Berikanlah penawar jiwa
Ku perlu Tuhan selamanya`,
    songNumber: 'B'
  },
  {
    id: 'B9b',
    title: 'KU TAK DAPAT HIDUP SENDIRI',
    lyrics: `Ku tak dapat hidup sendiri
Tuhan tolong padaku
Biarlah sinar FimanMu
T'rangiku s'babku tak dapat
Hidup sendiri

Ku tak dapat kerja sendiri
Tuhan tolong padaku
Biarlah sinar FimanMu
T'rangiku s'babku tak dapat
Kerja sendiri

Ku tak dapat jalan sendiri
Tuhan tolong padaku
Biarlah sinar FimanMu
T'rangiku s'babku tak dapat
Jalan sendiri`,
    songNumber: 'B'
  },
  {
    id: 'B10',
    title: 'KOTUMBAYAN OM KAHARAPAN TOKOU',
    lyrics: `Kotumbayan om kaharapan tokou
Aiso suwai nga id di Jesus Kristus
Minogowit Habar do Tosonong
Popotunud ralan do koposion

Kanou ukabo tokou oh ginawo
Kuma di Jesus, Boros do Kinoingan
Poiyomo lsio id ginawo nu
Posio Isio id koposion nu

Kanou masi mintutun id di Jesus
Kanou masi minsomok id di Jesus
Ralan tokou kaanu do guminawo
Ralan tokou kaanu do misokodung`,
    author: 'Fr. C. Piong',
    songNumber: 'B'
  },
  {
    id: 'B11',
    title: 'OUNSIKOU ITI GINAWO TOKOU',
    lyrics: `Ounsikou iti ginawo tokou
No-korongou Habar Dau tosonong
Tonudo tokou sontob kaajalan Dau
Ih nakahabar Dau kumaa do tokou

Iti no Habar Dau di Tosonong
Ih poinsurat id Buuk do tobitua
Ih popotuduk ralan di totopot
Kumaa dotokou ih koginawan Dau

Kada tokou no daa ko-rosi-ai
Do popointalang kotumbayan tokou
Mangai tokou no daa toguango
Miampai do aavi oh ginawo tokou

Sorohon tokou no ih Boros do Tuhan
Ih kiguno montok tokou ngaavi
Monuduk kowoyo-woyoon totopot
Kumaa dotokou ih koginawan Dau

Tonudo tokou no ih po-nuan Dau
Ku-maraja tokou montok Dau
Kanou no daa mogi-sosompuru
Miampai di Ama tokou hilo id surga`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'B'
  },
  {
    id: 'B12',
    title: 'JESUS TUHAN BOROs DO KINOINGAN',
    lyrics: `Jesus Tuhan Boros do Kinoingan
Manahak kalansanan doid tulun
Id di Jesus apasi daa ngaawi
Nung Boros Dau torimoon no

Torimoo no Boros do Kinoingan
Miampai ginawo do poingukab
Pogomuto no'd ginawo tokou
Pointalango id koposion tokou

Tulun ngaawi di mansau-ansau
Poinlansan no daa do apasi
Korongou Boros do Kinoingan
Jesus Tuhan posio no ngaawi`,
    author: 'Belia St. Theresa Tambunan',
    songNumber: 'B'
  },
  {
    id: 'B13',
    title: 'TORIMO NO ID GINAWO',
    lyrics: `Iti noh Habar kounsikaan
Mononobus nokorikot noh
Monitiu diti pomogunan
Torimo no id ginawo

Kanou no iwango oh ginawo
Monorimo di monon obus
Isio mana'ak pibabasan
Popi-iso id koginawaan

Kor: Kanou no tumungag om intangai
Torimo ih Jesus id ginawo
Jesus ninawau do koposion
Apasi nodii soumur-umur

Jesus no ih koposion
Nokorikot mantad di Tama
Moginawau do pomogunan
Manahak kaharapan`,
    songNumber: 'B'
  },
  {
    id: 'B14',
    title: 'MUNSIKOU OM ROMITO',
    lyrics: `Habar Tosonong norongou tokou
Jesus no ih ralan om koposion
Isio no' i Tanak do Kinoingan

Kor: Kanou no sawi-awi tokou
Munsikou om romito
Ukabo no tokou ginawo
Pogiroto no kotumbayaan

Poinlobi kopio koginawaan Dau
Pinatahak oh koposion Dau
Minamasi ngaawi do tokou

Sawi-awi Boros di Tuhan Jesus
Monginwagu koposion tokou
Mogigion doid kalansanan`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'B'
  },
  {
    id: 'B15',
    title: 'FIRMANMU TUHAN PELITA HIDUP',
    lyrics: `FirmanMu tuhan pelita hidup
Menerangi seluruh kehidupan
Terang bagi perjalanan ku

Kor: Kuasanya tiada tandingan
"Ia menyusuk amat dalam hidup
Memisahkan jiwa dan roh"

FirmanMu Tuhan menyembuhkan
Semua akan pulih dan kembali
Engkaulah harapan manusia

FirmanMu Tuhan menyelamatkan
Tiada seorang pun akan tersesat
Dalam cintaMu akan s'lamat

FirmanMu Tuhan menggembirakan
Berbahagialah yang taat padaNya
Kehidupan kekal pasti dapat`,
    author: 'Belia Bundu Kuala Penyu',
    songNumber: 'B'
  },
  {
    id: 'B16',
    title: 'INDAHNYA SUNGGUH FIRMAN TUHAN',
    lyrics: `Indahnya sungguh FimanMu oh Tuhan
Daya penarik bagi hidup
FirmanMu Tuhan membimbing
Membawa kepadaMu

Korus:FirmanMu hidup dan kuasa
Memb'ri hidup pada umat
KuasaMu sumber kekuatan
Meneguhkan iman kami

FirmanMu Tuhan penerang jiwa raga
Pemb'ri harapan dalam hidup
Dalam terangnya kami sedar
Mengikut jalan benar

Kami gembira menerima FimanMu
Penuh hati menghayatinya
Kami mohon agar diresap
Berakar dalam hidup`,
    author: 'Belia Beaufort',
    songNumber: 'B'
  },
  {
    id: 'B17',
    title: 'OH TUHAN PIMPINLAH LANGKAHKU',
    lyrics: `Oh Tuhan, pimpinlah langkahku
Ku tak b'rani jalan sendiri
SertaMu itulah doaku
Ajarku merendahkan diri

Menurut FimanMu setiap hari
Jadikan pelita dalam g'lap
Mencari domba yang sesat
Itulah kerinduan jiwa ku`,
    songNumber: 'B'
  },
  {
    id: 'B18',
    title: 'KOTOLUADAN OM KOUNSIKAAN',
    lyrics: `Kotoluadan om kounsikaan Tuhan
Habar koposion naataak Nu dahai

Korus: 'Yoku no ih Ralan
Katapatan, Koposion'
Itti no Habar Tosonong Dau
Kumaa dotokou

Kababasan, kounsikaan kaanu
Mantad Habar Tosonong do Tuhan

Piginawaan, piunungan kaanu
Mantad Habar Tosonong do Tuhan

Tuhan, Tuhan Habar Nu Tosonong
Poinsuni, poinggamut id ginawo ya

Kotoluadan, kounsikaan Tuhan
Notiitiu ralan koposion ya`,
    author: 'Fr. C. Piong',
    songNumber: 'B'
  },
  {
    id: 'B19',
    title: 'BOOS NU TAVASI OI TUHAN',
    lyrics: `Songkuo vinasi ih boos nu
Oi Tuhan
Poposindak pogigizon za
Boos nu oi Tuhan monitiu
Mogovit kumaa id Diau

Korus: Boos nu poimpasi om kikuasa
Manaak do koposizon za
Kuasa nu puun do kavakasan
Papavakas kotumbazaan

Boos nu oi Tuhan ponitiu
ginavo za
Manaak kaharapan poimpasi
Doid ninavau nu, koiho zikoi
Ngaavi sontob tavasi

Ounsikou zikoi monoimo do boos nu
Miampai do a-avi ginavo za
Onuan no daa ngaavi izikoi
Do koposizon s'lajul`,
    songNumber: 'B'
  },
  {
    id: 'B20',
    title: 'BOOS DO TUHAN',
    lyrics: `Korus: Ih boos do Tuhan
Id daasom ginavo
Ih boos do Tuhan
Pinaajal nu dogo

Ih au ku po ziau notoodo
Noihaan ku kozo ziau
Ziau no pinihi ku
Kakaal ko po doid doos di-ina nu
Hinoou ku no iziau
Ponokotanda ku

Koiho zou do omuhok ko
Pavakason ku iziau
Ponuon ku iziau do boos
Ugad no doid nombo nopo
Monuhuk do ponuuan ku
Ih noongou nu

Id nombo nombo ko nopo
Pointanud hongon ku
Zou ii ih koluang nu
Songian id kohigaganan
Doiho zou tomoimo
Id doos nu`,
    songNumber: 'B'
  },
  {
    id: 'B21',
    title: 'SUMAMBA DO MINAMANGUN',
    lyrics: `Oi tobpinai kinongoho, ii boros
do mamasi do pomogunan
Ii kikuasa popoidu
mantad do koimbayatan tangaraat

Mokiampun gia do douso om miiso
tokou id koginawaan dau
Kanou ngaavi sumambayang pogiroton
koginawaan di Tuhan

Cho: Kanou no sumamba do Minamangun
Poinsavato no longon om ginawo nu
Torimo no ii Raja Minonobus

Om kanou no do munsikou sabap
Tuhan id suang ginawo nu
Sumambayang miiso tokou tomposiyo ii
Jesus id koposion nu`,
    author: 'Belia Bingkor',
    songNumber: 'B'
  },
  {
    id: 'B22',
    title: 'BOOS DO TUHAN',
    lyrics: `Boos nu tobitua diti
Posuangon za doid ginavo
Miampai do lotion za
Jesus onuai kotuhungan

Chorus: Kotohuadan za doid diau
Koposizon ih noongou za
Mantad do Boos Nu tobitua
Oh………..

Jesus Boos nu di baino
Kilati kozo montok dagai
Sunudai zikoi oi Tuhan
Sebap au zikoi koiho`,
    songNumber: 'B'
  },
  {
    id: 'B23',
    title: 'YESUS BERTAKHTALAH',
    lyrics: `Yesus bertakhtalah
Tuhan Kaulah Raja
Yang hadir di tengah kami
Engkau kami sanjungi….

Kami sembah bina takhtaMu
Kami sembah bina takhtaMu
Kami sembah bina takhtaMu
Tuhan Yesus ambil tempatMu

Siapakah melawan Tuhan                     )
Dan melawan pujian umatNya           )2X
Tinggikan panji, Allah kebenaran
Dia datang 'tuk umatNya
Tingggikan panji, Allah kebenaran
Dia datang 'tuk baitNya`,
    songNumber: 'B'
  },
  {
    id: 'C1',
    title: 'TOIMOO TUHAN',
    lyrics: `Toimoo Tuhan titahak dagai
Pataakon dagai mangazou Diau
Zikou umikot miampai titahak
Ginavo sanang mangazou Diau

Chorus: Oviton dagai, titahak diti
Pataakon dagai doid Diau
Oi tuhan

Miampai ginavo potonudaon za
Tanda do koginavan za Diau
Toimoo oi Tuhan titahak diti
Pohubukon za mangazou Diau

Sundung omungkang kumaa id Diau
Zikoi humansan koginavaan Nu
Pavakaso no ginavo dagai
Kotumbazan za mai no pogioto`,
    author: 'Fr. C. Piong',
    songNumber: 'C'
  },
  {
    id: 'C2',
    title: 'PATAAKO NO DOID TUHAN',
    lyrics: `Poinsavato no hongon diozu
Pataako doid Tuhan kinoingan
Om nogi toinsanan doun diozu
Pataako no doid Tuhan

Bio no ngaavi kalaja do Tuhan
Ih vinangun sabap guno tokou
Dotokou diho do namoot nopo
Pataako no doid Tuhan

Poinsavato dotokou ginavo
Pataako doid Tuhan Kinoingan
Om sontob koginavaan tokou
Pataako no doid Tuhan

Nosompuu no tokou di baino
Minogovit do novitan sondii
Ounsikou 'sido monoimo diti
Pataako no doid Tuhan`,
    songNumber: 'C'
  },
  {
    id: 'C3',
    title: 'PATAAKON KU',
    lyrics: `Pataakon ku Diau, oi Jesus
Saviavi doun dogo
Ginovoon om hansanon
Ku iziau toi-mo-imo

Chorus: Pataakon ku, Pataakon ku
Saviavi doun dogo
Pataakon ku diau

Pataakon ku diau, oi Jesus
Sontob kounsikaan ku
Zadaan ku ngaavi sontob
Koimaan Tangalaat

Pataakon ku diau, oi Jesus
Izou sondii tumaak
Ponuo zou no do koginavaan
Om blakat nu

Pataakon ku diau, oi Jesus
Toimoo zou no baino
Doid Diau zou daa toimoimo
Id kasananga s'lajul`,
    songNumber: 'C'
  },
  {
    id: 'C4',
    title: 'TOIMOO NO MANTAD DAGAI',
    lyrics: `Onu nopo pinataak Nu
Do guno dagai saviavi
Pataakon za vagu Diau
Toimoo no mantad dagai

Iti novitan sabap Diau
Potohuodon miampai aavi
Koginavan za ngaavi
Toimoo no mantad dagai

Adadi no daa doid dagai
Do takanon om tinumon
Do koposizon s'lajul
Toimoo no mantad dagai`,
    songNumber: 'C'
  },
  {
    id: 'C5',
    title: 'OI AMA DO TAAZOU',
    lyrics: `Oi Ama do taa-zon
Toimoo titaak dagai
Iti louti om anggur
Ih pohubukan za
Miampai kuasa do Boos Nu
Adadi daa iti
Do Tinan om Zaa Nu
Montok guno dagai

Sundung au songkuo kaa-padan
Kohubukan diti
Nga pataakon za Diau
Iti ngaavi nitaak nu
Ginavo, pomusaa-van
Pataakon Diau ngaavi
Mantad kooiban di Maria
Baino idoos dagai`,
    songNumber: 'C'
  },
  {
    id: 'C6',
    title: 'TUMAAK ZOU DIAU',
    lyrics: `Tumaak zou Diau Sondii
Do kumalaja doiti id pomogunan
Mimang do kalaja nu
Doid nombo-nombo nopo
Papatazad kaajalan Nu

Tuhuko kaandak ginavo Ku,
Koimaan sumasi do koginavaan nu
Tamangai tikid tadau,
Pavakaso, potunudo
Sumuupu Kinoingan id savat

Hongon ku taakon ku Diau Tuhan
Posodiao sumupu doid ngaan nu
Monuhung tuhun ngaavi
Miho koginavan Nu, om
Konsikou no ngaavi id Diau
(Tumaak, tumaak, zou Diau)`,
    songNumber: 'C'
  },
  {
    id: 'C7',
    title: 'DOID DIAU OVITON DAGAI',
    lyrics: `Diod Diau, oi Kinoingan
Oviton dagai
Tuva do k'laja, tikid tadau-
Au mongimuot Diau
Isai vokon za
Id kotumbazaan, mi-iso zikoi/

Onsikou nokongou,
ngaavi do Boos Nu,
Om baino sumimba, miampai titaak
Pataakon ngaavi Diau
Sontob do doun dagai
Kotumbazaan za
Pogioto no

Id louti om anggur
Tumaak zikoi Diau
Miampai ginavo om tinan za
Pododizo iti,
Tinan om Zaa Nu
Do Takanon za, om Tinumon/

Onuo no ngaavi 'ti
K'laja om koimaan za
Onuai kahansanan ginavo za
Nunu notohiban, soovon no do migit
Ih Tuhan Kinoingan
Kahansanaan`,
    songNumber: 'C'
  },
  {
    id: 'C8',
    title: 'TOIMOO NOVITAN',
    lyrics: `Ref: Toimoo novitan do tuhun nu
Ih nosompuu sabap ngaan nu

Tama id surga Ih Vovozon
Taakon za Diau kohubukan 'ti
Kosianai dagai oi Tuhan
Hiongo ngaavi oh dousa za

Taakon za Diau kounsikaan za
Inuzan, k'laja om kosintukan
Kosusaan ngaavi do tikid tadau
Ing-gaa-a-nai no boboon za

Onuo no iti titaak za
Mantad dagai songovian
Id kobian nogi di ta'aino
Poinsavaton za ginavo za

Insiano zikou no oi Tuhan
Tuhun Nu ngaavi di nakaahau
Toimo no iti sogit za
Opio id ginavo Nu selajul`,
    songNumber: 'C'
  },
  {
    id: 'C9',
    title: 'TOIMOO TITAHAK DAGAI',
    lyrics: `Toimoo no iti titahak dagai
Sontob nopo doun dagai
Guminavo om humansan zikoi
Sontob nopo doun Tuhan

Korus: Toimoo Tuhan iti titahak
dagai doid Diau 
Toimoo iti titahak dagai
Sontob nopo doun dagai
Sontob nopo doun dagai

Zikoi ih bo -ti, Tuhan
Poingkakat idoos nu
Kinongoo no'ti pokionuon dagai
Doiti it toguvang nu

Toimo zikou no do baino
Gumuhi zikoi doid Diau 
Kosianai no dagai Tuhan
Zikoi tuhun kihasa`,
    author: 'Joseph Lansing',
    songNumber: 'C'
  },
  {
    id: 'C10',
    title: 'TOIMOO ITTI TITAAK ZA',
    lyrics: `Korus: Toimoo iti titaak za
Ih pataakon za
Miampai koginavaan
Doid diau

Notitimung zikoi no do baino
Mamung diti kohubukan id ngaan nu
Ponokotanda nogi do koisaan
Id ngaan nu, id ngaan nu

Tuhun ngaavi zikoi doi notobus Nu
Sabap di kohubukan Nu son-dii
Invoguvan vagu dagai iti baino
Kumaa Diau Oi Tuhan`,
    songNumber: 'C'
  },
  {
    id: 'C11',
    title: 'HANSAN NO DOID TUHAN',
    lyrics: `Intro:Hansan no doid Tuhan kinoingan
Hansan no doid Tuhan Kinoingan

Cho: Ada tongob, ada kakasou
Do nunu nopo gunoon diozu
Do baino om tikid tadau

**Om hansan no doid.......**

Vinangun tokou ngaavi do Kinoingan
Tantu no do tamangan tokou ngaavi
Ginovoon tokou ngaavi Disido
Mantad baino gisom do apatai

(chorus)

Ada-ha-an do kuasa do Kinoingan
Pointahib kozo oh koginavaan Dau
Kanou no tumatap humansan Disido
Mokianu sontob gunoon tokou

Koiho ngaavi Tuhan Kinoingan
Do nunu ngaavi gunoon tokou
Humansan nopo doid Disido
Om otoimo ngaavi pokionuon zu`,
    songNumber: 'C'
  },
  {
    id: 'C12',
    title: 'BLAKATAI, TOIMOO NO ',
    lyrics: `Tuhan Kinoingan , Ih pantangon
Do tuhun notobus
Pataakon dagai Diau 
Ngaavi iti titaak za

Toimoo om onuo no ngaavi
Iti patakon Diau
Om nogi toinsanan
Zikoi ih tumaak Diau

Mantad do kohubukan diti
Do kaanu daa baagi
Doid koginavan
Om koposizon Nu sondii

Cho: B'lakatai, toimoo no
Iti kohubukan za`,
    songNumber: 'C'
  },
  {
    id: 'C13',
    title: 'ALAPON MU TUHAN',
    lyrics: `Alapon mu Tuhan pataakon mai
Pataakon mai mamarayou diyun
Akai sumuku angibit pataakon
Guang mai sanang mamarayou diyun

Korus :Ibiton mai
Gitu pataakon
Diyun Tuhan
Tuhan mai

Dad guang mai pabayaan mai
Tanda do guminawo akai diyun
Alapo Tuhan pataakon mai
Pataakon mai mamarayou diyun

Akai amungkang sumuku ak diyun
Akai lumansan koginawan mu
Poikango noh guang mai
Kapisayaan mai paikango dami`,
    author: 'Fr. C. Piong',
    songNumber: 'C'
  },
  {
    id: 'C14',
    title: 'BAGI YESUS KUSERAHKAN',
    lyrics: `Korus :'Ku serahkan ku, 'Ku serahkan ku
'Ku serahkan seluruhnya,
Bagi Yesus Ku

Bagi Yesus 'ku serahkan,
Seluruhnya jiwaku
Pada tanganMu, Ya Yesusku,
Ku serahkan diriku

Bagi Yesus 'ku serahkan,
Hatiku yang bertegar
Ajak Yesus mengampuni,
Jiwaku yang bercemar

Bagi Yesus 'ku serahkan,
Hati ku yang bersesal,
Ker'na Yesus, Mahamurah,
CintakasihNya kekal

Bagi Yesus 'ku serahkan,
Hatiku yang bersyukur
Dengan api Roh'ul Kudus,
Pohon kasih penghibur

Bagi Yesus 'ku serahkan,
hidupku segalanya,
T'rimakasih, Tuhan Yesus,
Puji-puji Namanya.`,
    songNumber: 'C'
  },
  {
    id: 'C15',
    title: 'OI KINOINGAN ISAI KATAAN DAA',
    lyrics: `Oi Kinongan isai kataan daa,
Kokito do Tuhan taazou
Poinhoub pointubung Kinoingan Dau
Do ompunon oh Tanak Dau

Chorus: Jesus manaak poogi izou
Ih doun dogo doid Diau (2x)

Jesus nakagaan ko nodii
Dogo ih do kalaatan
Nahapasan oh koduuduvo
Mantad diti kinagasan

Oi Jesus ku, songkuo ginazo
Do kalaatan do douso ku
Ih pinapapapak id Salip
Hongon duvo di gakod nu`,
    songNumber: 'C'
  },
  {
    id: 'C16',
    title: 'PONGINAMAN KAPATAAKAN',
    lyrics: `"Nung Tanak Ko do Kinoingan
Nga sunudai 'lo wata
Dumadi do roti akanon"
Ka di rogon minonginam.
"Tulun nopo nga au apasi
Mantad nopo do routi,
Nga saawia-wi Boros,
Mantad Kinoingan."

"Nung Tanak Ko do Kinoingan,
Tu'un no om intangan,
Romiton ko ma do Tasab
Au nodii osin-dualan."
Nga ka di Tuhan Jesus
"Kada ponginamai,
Tuhan Kinoingan nu,"ka di Tuhan.

Sinindak barang pomogunan
Pinokito ih Tanak Kinoingan
"Pataakon ku ngaawi Dika 'ti,
Nung tumungub Ko sumambah dogo
"Rogon, pogidu no,
Tuhan Kinoingan no,
Sambaon om ingga suai", ka di Tuhan.`,
    author: 'Belia Toboh Tambunan',
    songNumber: 'C'
  },
  {
    id: 'C17',
    title: 'OI AMA TORIMOO NO ITTI KOLUBUKAN',
    lyrics: `Kinoingan Ih Koposiyon
Kanou momolubuk do titahak tokou
Doid Kinoingan Ih Tama tokou
Polubukon ya iti Routi

Mantad kooiban di Kristus
Ih minatai sabap do tulun ngaawi
Ih minatai do apasi no daa ngaawi
Oi Ama, torimoo no, iti kolubukan

Kinoingan Ih Koginawan
Kanou momolubuk do titahak tokou
Doid Tuhan lh Tawakas kopio
Polubukon ya iti Anggor

Mantad kooiban di Kristus
Ih minonobus tokou doid koginawan
Ih mina-ngajar tokou do guminawo
Oi Ama, torimoo no iti kolubukan

Kinoingan Ih Tuhan
Kanou momolubuk do titahak tokou
Oi Ama onuai do pibabasan
Iti pomogunan do baino

Mantad do kolubukan diti
Doid koginawan om kounsikaan do Tuhan
Doid koginawan om kounsikaan di Tanak Nu
Oi Ama, torimoo no, iti kolubukan.`,
    author: 'Fr. W. Poilis/Justin Lusah',
    songNumber: 'C'
  },
  {
    id: 'C18',
    title: 'PATAAKON ZA NGAAWI DIAU',
    lyrics: `Kor: Pataakon za ngaavi Diau
Ih sontob nakataak Nu doid dagai

Apantang Ko no daa, Tuhan Vozoon
Doid potootongkop do vinoun
Om saviavi bangsa

Kapatangan, kuasa, om kazaan
Patut no Diau tomoimo
Om id nombo nopo

Sabap poogi, baino, do notimung
Mamung do kolubukan 'ti
Doid kapantangan Nu`,
    songNumber: 'C'
  },
  {
    id: 'C19',
    title: 'TUHAN ITI NO TITAHAK ZA DIAU',
    lyrics: `Toimo no iti titahak za
Kotohuadan za Diau
Mantad kovosian nu
Do mouhagang Diau

Korus: Tahakon za oh ginavo
Kumaa Diau Tuhan
Zioy no suupu Nu Tuhan
Mokianu Diau kovosian

Pokuato no ginavo za
Kaanu zioy momohubuk
Sumambayang doid Diau
Toimoo titahak za

Toimon za ka'ajalan Nu
Potuhuno grasia Nu
Kuma doid dagai
Toimoo titahak za`,
    author: 'Joseph Lansing',
    songNumber: 'C'
  },
  {
    id: 'C20',
    title: 'TERIMALAH PERSEMBAHAN KAMI',
    lyrics: `Oh Tuhan, oh lihatlah 
Kami ini miskin hina,
Tak punya apa-apa
Hanya lagu kami persembahkan
Sebagai tanda cinta
KepadaMu ya Tuhan

Oh Tuhan, oh terimalah 
Lagu persembahan kami
Walaupun tak semerdunya
Dengan penuh hati kami nyanyikan
Untuk menyampai kata,
Hasrat cinta kami pada Mu

Oh Tuhan, oh dengarlah 
Kami memohon pada Mu 
Turunkan Roh Kudus Mu 
Untuk menerangi jiwa kami
Supaya kami teguh
Di dalam cinta kasih Mu 
Di dalam cinta kasih Mu`,
    songNumber: 'C'
  },
  {
    id: 'C21',
    title: 'KORBAN KU',
    lyrics: `Ya Allah, Tuhan yang Esa 
Allah Bapa mahapengasih 
Ku curahkan cinta kasih ku
Tanda korban ku

Kor:  PadaMu Tuhan, Kami bersyukur 
Sebab Yesus, korban yang indah

Roti anggur, ku persembahkan 
Serta jiwa yang ku serahkan 
T'rimalah, t'rimalah, ya Bapa

Ya Bapa yang maharahim
Ampunilah kesalahan kami
B'rikanlah hidup yang kekal
Kami anakMu

Jadikanlah kami sendiri
Persembahan hidup padaMu 
T'rimalah, t'rimalah, Ya Bapa`,
    songNumber: 'C'
  },
  {
    id: 'C22',
    title: 'TOIMOO OM POBITUAHO NU',
    lyrics: `Notimung zikoi id doguvang Nu
Sabap no do koginavaan Nu
Papataak do tuva do k'laja za
Pohubukon doid diau oi Tuhan

Korus: Ponitingo no oh ginavo za
Om kapadan zikoi nodii
Kopi-iso miampai Diau Tuhan
Kopisompuu doid Diau Tuhan

Iti novitan pataakon Diau 
Tanda do koginavaan za diau
Umampai zikoi id kohubukan 'ti
Toimoo om pobituaho no

Louti om Anggur pohubukan za
Iti no ngaavi nakataak nu
Poguhion vagu kumaa Diau Tuhan
Tanda do kasamban za Diau`,
    author: 'Belia Beaufort',
    songNumber: 'C'
  },
  {
    id: 'C23',
    title: 'TUHAN KINI BERLUTUT',
    lyrics: `Tuhan kini berlutut,
Penuh hormat dan sujud
Hati sanubari ikut walau tidak patut

Ku persembahkan milikku,
Jiwa serta ragaku
Tandakan cinta kasihMu
padaMu ya Allah ku

Pandanglah kami ya Tuhan,
Para umat pilihan
Ampunilah kesalahan,
jauhkan kejahatan

Korus: Syukur 'tuk cinta kasih Tuhan.
Yang telah kau limpahkan
S'bagai sumber kehidupan,
PuteraMu Kristus Tuhan`,
    songNumber: 'C'
  },
  {
    id: 'C24',
    title: 'MARI MEWARTAKANNYA',
    lyrics: `Ref:  Mari mewartakannya
Agar dunia melihatnya
Mari mewartakannya
Di sini ada Tuhan

Sudi mendengarkan
Pasang telingamu
Ketahuilah dunia
Sini ada Tuhan, ya!

Dermakan milikmu
Sesama mengeluh
Sebagai balas jasa
Kristus di samping mu, ya!

Dengarkan suaranya
Santaplah denganNya
Roti yang kita makan 
Adalah TubuhNya, ya!`,
    songNumber: 'C'
  },
  {
    id: 'C25',
    title: 'DOID DIAU OI TUHAN',
    lyrics: `Doid diau oi Tuhan
Mikot zikoi no id doos Nu
Miampai titaak oviton za
Patakon diau

Korus: Patakon za Diau Tuhan
Louti do koposizon
Sasavan di kapamasizan
Montok koponobusan za

Mantad kuasa Nu
Dodizo no ti'doid dagai
Dumadi do Tinan om Zaa di Jesus
Guno dagai

Onuai oi Tuhan
Ginavo tavasi oh tuhun nu
Pogioto id dagai kotumbazan za
Doid diau`,
    author: 'Belia Beaufort',
    songNumber: 'C'
  },
  {
    id: 'C26',
    title: 'TUMAAK DOID TUHAN',
    lyrics: `Korus: Kumakat hongon ku oi Tuhan
Toimoo no titaak ku
Miampai ginavo ku, ngaavi tumaak 
Posondoto hongon ku oi Tuhan 
Izou sondii tumaak
Ginavo ku, miampai aavi tumaak

Toimoo Tuhan titaak ku
Ih doun Diau gumuhi doid Diau
Pataakon ku mangazou Diau oi Tuhan
Izou tuhun kidouso oi Tuhan
Sabap id Diau koposizon selajur 
Pataak kotos sontob doun dogo

Toimoo Tuhan titaak ku
Novitan ku humubuk munsikou
Miampai kagos koginavaan ku
Diau oi Tuhan

Pataakon ku Diau id kounsikaan 
Miampai sogit samba koginavaan
Soumul-umul zou daa id Diau oi Tuhan`,
    songNumber: 'C'
  },
  {
    id: 'C27',
    title: 'TITAHAK DI OTOPOT',
    lyrics: `Oi Tuhan pataakon daa Dika 
Titahak mantad ginawo ya
Titahak di otopot kopio
Tinan ya om koposion ya

Oi Kristus guminawo koi Dika 
Tu ika noi monunsub dagai
Do masi id kaharapan
Oi Kristus ginowoo koi no

Cho:  Do apasi no daa selajur
Dumandi do poingoros Dika
Do asanang nodi selajur
Do mada mihad potilombus

Oi Tuhan titiho no ralan
Tulokon hakod ya'd mamanau
Id ralan di kaandakan Nu
Do au nodii koinsodu Dika (Chorus)

Oi Ama barakatai koi no
Id koposion tikid tadau
Do mongoi awasi no daa ngaawi 
li ralan do koposion ya (Chorus)`,
    songNumber: 'C'
  },
  {
    id: 'C28',
    title: 'KANOU TUMAHAK DOID TUHAN',
    lyrics: `Ginawo poingukab tumahak doid Tuhan
Sontob gunoon tokou pataako 
no doid Tuhan

Korus:  Kanou no, kanou no,
Tumahak, tumahak om munsikou
Miampai paparayou,
om monongkotoluod doid Kinoingan

Kanou popolubuk miampai paparayou
Tumahak doid Kinoingan, 
miampai diti kolubukan

Soira id kosusaan, patako no doid Tuhan
Soira id kasanangan, 
munsikou id Kinoingan

Kanou no munsikou, 
munsikou tokou baino 
Sabap poingampai,
tokou nodi doid Kinoingan`,
    author: 'Belia Bingkor',
    songNumber: 'C'
  },
  {
    id: 'C29',
    title: 'PERSEMBAHANKU',
    lyrics: `Betapa hatiku, berterima kasih - Yesus 
Kau mengasihiku, Kau memilikiku.
Hanya ini Tuhan, persembahanku 
Segenap hidupku, jiwa dan ragaku, 
S'bab tak ku miliki, harta kekayaan
Yang cukup bererti, 
u'tuk ku persembahkan.
Hanya ini Tuhan, persembahanku 
Terimalah Tuhan, permohonanku, 
Pakailah hidupku, sebagai alatMu, 
Seumur hidupku.

( Ulang 3x )`,
    songNumber: 'C'
  },
  {
    id: 'D1',
    title: 'JESUS II IKOTON TOKOU',
    lyrics: `Isai-isaj nopo diozu
Ih mogium kasanangan
Mantad k'laja kosintukan
Toi katangaban ngaavi

Chorus: Jesus, Ih ikoton tokou
Ih tuminaak sondii
Miampai do kinapatazon
Dau doiho id salip.

Kinongo songkuo tinohuodod
Do tahap Dau tokou
Sontob pak'laja ikot noode
Om onuàn kou kơundangan

Songkuo vagu kotohuadan
Do pokionuon diozu
Suvai mantad kinapatazon
Dau doiho id salip

Hiungai zou mantad douso ku
Miampai diho zaa Nu
lh nokohuzung id tana
Mantad do tobik Nu`,
    songNumber: 'D'
  },
  {
    id: 'D2',
    title: 'ATANGKANGAU ZOU DOGO SONDII',
    lyrics: `Atangkangau zou do dogo sondii
Ih ngaavi maahib-tahib
Nga baino 0ongou ku no ohou
"Ikot no, om onuan kou ngaavi"

Chorus: Onuai no zikoi
Ih doun surga 
Oi Tuhan, tuhuko no ngaavi
Iziziau no koiho do gunoon za
Baino pataako no doid dagai

Gumu tuhun do baino mogium do kuasa
Migit do doun pomogunan
Nga aiso ma kaaga kiguno
Di pataakon di Jesus Tuhan

Soovo no baino oi tambahut kou
Aiso ii mati do guno
Di katangkangau tokou doiti
Suvai ko ii doun Kristus Tuhan`,
    songNumber: 'D'
  },
  {
    id: 'D3',
    title: 'MIKOT II JESUS',
    lyrics: `Omungkang zikoi sondi
Mokituhung do Tuhan 
Au zikoi asantaban
Nung au ko mikot doid dagai

Chorus: Jesus ikot doid dagai 
Iti no pokionuon Diau
Tadau tadau idoos Nu
Ikot no id tanga dagal
 
Onuai zikoi do grassia
Pamahavan do k'latan
Iziau oh hansanon
Tadau tadau tumanud Diau

Ontok kapatazon za
Hongon Nu pokionuon za
Sokodungo do muhi
Id surga ih uhion za`,
    songNumber: 'D'
  },
  {
    id: 'D4',
    title: 'TAMA ZA',
    lyrics: `Oi Tama za – Doid surga
Apantang daa
Oh ngaan Nu (2x)

Koikot daa – Kopomolintaan Nu
Adadi doid tana
Miaga doid surga (2x)

Pataako dagai – Do tadau diti
Oh takanon za 
Do sanga-ngadau (2x)

Pohiongo zikoi – Do douso za
Miaga dagai Do popohiong
Di papakaus dagai

Ada pohogoso – Doid koimbazatan
Pahapaso no
Mantad kalaatan (2x)`,
    author: 'Fr. C. Piong',
    songNumber: 'D'
  },
  {
    id: 'D5',
    title: 'IH JESUS NO',
    lyrics: `Kivaa songubun guminavo
Disontob nangakalavong
Ada kou no konini ginavo
Do minsomok Disido

Chorus: Ih Jesus no iho.
Ih Jesus no iho
Hagahap ngaavi dotokou
Do tumaanud Dau

Sundung potuu do zadaan kou
Do kinoluangan zu sondii
Nga kada kou no kotongob
Tu kivaa ii mongoluang

Songian do kikosusaan kou
Om oso-ngu-hu-nan diozu
Ondomon no diozu tomoimo
Isai sinuak do tandus

Ada kou no imang tongob
Ontok himuton do tuhun
Hansan kou no doid songuhun
Ih guminavo 'tokou`,
    songNumber: 'D'
  },
  {
    id: 'D6',
    title: 'POINGANDAD IH JESUS',
    lyrics: `Ih Jesus poi-ngan-dad, mo-kii-vang diozu
Nokuo tu au poosuangon
Id ginavo diozu daa izonon Dau
Onu tisimba diozu

Ref: Aasasau no do mokiiyang diozu
Baino, kakai po poingandad
Nokuo, tu ahangas ginavo diozu
Poingandad po Ih Jesus

Gazo koginavan di Jesus diozu
Sabap pogi minatai
Om baino magahap Isido diozu
Nga au kou popoduli

Poingkuo no pomuginavan diozu
Montok tahap Disido
Oupus kou no nangku do kotos, usin
Hobi mantad di Jesus`,
    songNumber: 'D'
  },
  {
    id: 'D7',
    title: 'OONDOS GINAVO KU',
    lyrics: `Refrain:Oondos ginavo ku do baino
Poingamung no di Ih Jesus dogo

Mantad no Diau Tuhan
Do kaanu zou, toimoimo
Koimaan tangavasi

Itti no kandaakaan Nu
Do guminavo zou do
Songovian tuhun

Iziau no sondion ku
Songian kikosompitan
Om kikatangaban

Tuhan kandak ko dogo
Do manaak pombitanan
Tangavasi doid tubun`,
    songNumber: 'D'
  },
  {
    id: 'D8',
    title: 'ITI NO KAANDAKAN OM PONUUAN KU',
    lyrics: `I-iti no kandakan Ku
Om nogi ponuan Ku diozu
Ginovoo no oh vokon
Miaga di koginavan Ku diozu

Aiso ginazo koginavan
Suvai mantad di koginavan
Do tuhun di obintuhung
Do kinoluangan ngaavi dau

Okon pinibi Zou diozu
Izou Sondii minomihi
Do tomoimo om selajul
Poingampai kou di daa Dogo

Onu nopo pokionuon zu
Di Ama Ku doiho id surga
Tomoimo do otoimo zu
Nung mokia-nu kou id Ngaan Ku`,
    songNumber: 'D'
  },
  {
    id: 'D9',
    title: 'IH JESUS ID SUANG GINAVO',
    lyrics: `Ih Jesus id suang ginavo ku
Sosongian zou nopo
Kasambut Dau
Ih Jesus minatai sabap dogo
Miampai kotumbazaan notoimo no

Chorus: "Iti no Tinan Ku, om Zaa Ku
Toimoo no savi-avi kou.
Songian do otoimo tokou iti
Ih Kristus om zotokou iso di

Pataako dagai do tadau diti onom
Oh akanon dagai do tikid tadau
Hiongo ngaavi oh kahasaan za
Om potuhido no ginavo za

Jesus pahapaso ngaavi zikoi
Mantad ngaavi do kala'tan
Kotumbazaan dagai pogioto no
Do kapadan di do tumanud Diau`,
    songNumber: 'D'
  },
  {
    id: 'D10',
    title: 'ISIDO NO TOIMOON NU',
    lyrics: `Intro: Isai katama mizon id Diau, Tuhan?
Isai koundo-ong id kasanangan Nu?

Ih tumanud ponuuan ngaavi do Tuhan
Ih avasi ginavo om koimaan

Ih guminavo ngaavi do tuhun
Ih obinsianan songian ahasaan

Ih obintuhung do vokon
Ih au momihii do suvai

Ih au mana'u do suvai tuhun
Ih au mogohimut do vokon

ANT: Isido no toimoon Nu`,
    songNumber: 'D'
  },
  {
    id: 'D11',
    title: 'JESUS KOGINAVAAN ZA',
    lyrics: `Jesus koginavaan za 
Tamangai zikoi no
Ontok do kahasa 
Potunudo zikoi no
Tomoimo ko daa id doos
Jesus koginavan za
Tomoimo ko daa id doos
Jesus koginavan za

Songkuo di vinasi Nu
Do mikot ko doid dagai
Ontok oimbazatan
Pavakaso zikoi no
Pogioto daa tomoimo
Jesus koginavan za
Pogioto daa tomoimo
Jesus koginavan za

Oi Jesus tobinsianan
Toimoo zikoi no
Songian mahik doid Diau
Tumongob do hasa za
Balakatai zikoi no
Jesus koginavan za
Balakatai zikoi no
Jesus koginavan za

Kotohuadan oi Jesus
Do minikot id dagai
Zaa om Tinan notoimo
Id suang ginavo za
S'lajul monongkotohuod
Jesus koginavan za
S'lajul monongkotohuod
Jesus koginavan za`,
    songNumber: 'D'
  },
  {
    id: 'D12',
    title: 'IZIAU NO',
    lyrics: `I-ziau no, I-u-mon ku
Id koposizon

I-ziau no, oh titiu ku
Solilinaid. Oh – Tuhan

I-ziau no, Manahak dogo
Koposi – zon

Koginavaan Nu doid dogo
Manahak dogo do vinakas

I-ziau no, Sinu'au ku
Id kohunggu-zan

Iziau no, harapon ku
Id koimbazatan.
Oh - Tuhan`,
    author: 'Fr. C. Piong',
    songNumber: 'D'
  },
  {
    id: 'D13',
    title: 'ENGKAU JAWAB HIDUP KU',
    lyrics: `Engkaulah jawab
Yang ku cari
Engkau terang ku
Dalam hidup ku
Senang hati ku
Bersamamu, oh-oh-oh Tuhan

Engkaulah sumber
Pada bidup ku
Kasih pada ku
Aku berlindung
Pada mu Tuhan
Dalam segala, rintangan hidup

Engkaulah gembira
Pada hidup ku
Nyanyian pada ku
Aku gembira
Bersama mu
Dalam perlindungan, kuasa mu`,
    author: 'Fr. C. Piong',
    songNumber: 'D'
  },
  {
    id: 'D14',
    title: 'SYUKUR YESUS AKU DAPAT HIDUP',
    lyrics: `Syukur Yesus aku dapat hidup
Sebab Yesus yang mati di salip
Yesus mati di salip
Untuk sl'mat aku,
Syukur Yesus aku dapat hidup

Hati sedih kerana dosa ku
Sehingga Yesus datanglah menghibur
Syukur Yesus yang datang
Untuk hibur aku
Syukur Yesus aku dapat hidup

Banyak perkara belum diketahui
Perkara ini aku tentu yakin
Hari itu Yesus panggil
Dosa ku disuci
Syukur Yesus, aku dapat hidup`,
    songNumber: 'D'
  },
  {
    id: 'D15',
    title: 'LINDUNGILAH DAKU TUHAN',
    lyrics: `Oh-oh Tuhan ku padaMu ku mengaduh
Mengapakah kau biarkan ku tergoda?

Korus: Oh Tuhan pada mu
Harapan hidup ku
Lindungi daku Tuhan

Dalam hidup ku,
Ku perlukan terang mu
Ku sangat lemah,
b'rikanlah semangat mu

Dergarlah Tuhan,
Keluhan ku pada mu
Doa ku Tuhan,
Agar s'lalu ku taat

Ku tak mengerti
Kehendak mu Oh Tuhan
B'ri daku iman dalam
Seg'la godaan`,
    author: 'Fr.C. Piong',
    songNumber: 'D'
  },
  {
    id: 'D16',
    title: 'YESUS SAHABAT SEJAT',
    lyrics: `Yesus sahabat sejati
Yang memb'rikan sentosa
Tiap hal boleh ku bawa
Dalam doa padaNya
Bila hatiku gelisah
Aku salah dan lemah
Ker'na lalai S'rahkan hidup
Dalam doa padaNya

Jika oleh pencobaan
Kacaubilau hidupmu
Jangan lagi putus asa
Pada Tuhan berseru
Yesus Kawan yang setia
Tidak ada taraNya 
Ia tahu kelemahanmu
Naikkan doa padaNya

Adakalah hatimu susah
Berbeban serta lelah
Yesuslah pelindung kita
Naikkan doa padaNya
Walau handai ta'setia
Yesus kawan yang baka
Ia mau menghibur kita
Naikkan doa padaNya`,
    songNumber: 'D'
  },
  {
    id: 'D17',
    title: 'PIMPIN KU TUHAN',
    lyrics: `Pimpin ku Tuhan dari jalan dosa
Pimpin ku pulang padaMu
Ku sangat lemah tak sanggup berdiri
Tuhan ku mengiring dikau

Aku sesat sebab jalan dosa
Sangat berdosa padaMu
Tiada penghibur di dalam jiwa ku
Tuhan ku mengiring dikau

Hidup berdosa kehendak sendiri
Ikut jalan yang berliku
Atas salip Tuhan ganti aku
Tuhan ku mengiring diķau`,
    songNumber: 'D'
  },
  {
    id: 'D18',
    title: 'TUHAN SUMBER GEMBIRAKU',
    lyrics: `Korus: Semua bunga ikut bernyanyi,
Gembira hati ku
Segala rumput pun riang ria
Tuhan Sumber gembira ku

Semua jalan di dunia
Menunujukmu ke syurga
Disiran angin nan mesra
Belayanmu ke syurga

Semua geloran di dunia
Haruslah kau jalani
Bersama dengan sengsara
Menuju pada Bapa

Semua permatang sawah
Menanti telapakmu
Derita dia bersama
Melihatkan nan subur

Semua orang di bumi
Membawakan iman mu
Hiburanmu yang abadi
Lepas sudah berhenti`,
    songNumber: 'D'
  },
  {
    id: 'D19',
    title: 'BERSARLAH TUHAN',
    lyrics: `Besarlah Tuhan,
Dan sangatlah terpuji
Di Kota Allah kita,
GunungNya yang kudus permai
Ada kegirangan, baginya seluruh alam,
Bukit Sion itu,
Letak Kota Raja Besar.

Besarlah Tuhan,
Dan sangatlah terpuji
Di Kota Allah kita,
GunungNya yang kudus permai,
Ada kegirangan, baginya seluruh alam,
Bukit Sion itu,
Letak Kota Raja Besar.
Bukit Sion itu
Letak Kota Raja Besar`,
    songNumber: 'D'
  },
  {
    id: 'D20',
    title: 'WAKTU HIDUP KU',
    lyrics: `Waktu hidup ku, waktu masuk ku
Aku percaya dengan rendah hati,
Akan Yesus ku

Waktu hidup ku, waktu senang ku
Aku mengasih dengan tulus hati
Akan Yesus ku

Waktu hidup ku, waktu susah ku
Aku memohon dengan sedih hati,
Akan Yesus ku

Waktu hidup ku, waktu miskin ku
Aku meminta dengan sabar hati,
Akan Yesus ku

Waktu hidup ku, waktu miskin ku
Aku berdoa dengan tabah hati,
Akan Yesus ku

Waktu hidup ku, waktu mati ku
Aku mengharap dengan sungguh hati,
Akan Yesus ku`,
    songNumber: 'D'
  },
  {
    id: 'D21',
    title: 'HATI KU GEMBIRA',
    lyrics: `Hati ku gembira, Tuhan datang padaku
Mari Tuhan, datang pada ku (2x)

Hati ku gembira, Tuhan tinggal pada ku
Mari Tuhan, tinggal dalam ku (2x)

Hati ku gembira, Tuhan disamping ku,
Mari Tuhan, disamping ku (2x)

Hati ku gembira, Tuhan hibur pada ku
Mari Tuhan, hibur pada ku (2x)

Hati ku gembira, Tuhan lindung pada ku
Mari Tuhan, lindung pada ku (2x)

Hati ku gembira, Tuhan berkat pada ku
Mari Tuhan, berkat pada ku (2x)

Hati ku gembira, Tuhan dengar pada ku
Mari Tuhan, dengar pada ku (2x)`,
    songNumber: 'D'
  },
  {
    id: 'D22',
    title: 'AKUKAN NYANYI SETIA PADA TUHAN',
    lyrics: `Aku'kan nyanyi setia Tuhan
Selama, ku nyanyi, ku nyanyi
Aku'kan nyanyi setia Tuhan,
Sclama, ku nyanyi setia pada Tuhan

Korus: Dengan mulut, ku kenalkan
KesetiaanMu, KesetiaanMu,
Dengan mulut, ku kenalkan,
KesetiaanMu, pada semua Umat

Aku'kan nyanyi setia Tuhan
Selama, ku nyanyi, ku nyanyi
Aku'kan nyanyi setia Tuhan,
Selama, ku nyanyi setia pada Tuhan`,
    songNumber: 'D'
  },
  {
    id: 'D23',
    title: 'ANUGERAH YANG AJAIB',
    lyrics: `Sangat besar anug'rahMu
Yang b'ri aku s'lamat,
Ku t'lah hilang Tuhan dapat,
Buta s'karang lihat

Indahlah anug'rah itu
yang mem'bri sentosa
Ternyata pada hatiku waktu ku percaya

Dalam bahaya dan jerat jiwa ku
t'lah datang,
Oleh anug'rah kus'lamat jiwa ku senang

Tuhan berjanjilah yang baik
tetaplah sabdaMu,
Ku akan jadi P'risaiku sepanjang Umur

Ya Tuhan bila hambaMu
Menghadap ajalku
Anug'rahmu itu memb'ri
Sentosa sepenuh

Meski sudah selaksa tahun
hidup dalam surga,
Rasanya baru dimulai memuji'kan Dia`,
    songNumber: 'D'
  },
  {
    id: 'D24',
    title: 'HIDUP BAGI KRISTUS, MATI UNTUNG',
    lyrics: `Hidup bagi Kristus, mati untung
Dibimbing Dia di jalan yang sempit,
Ada tent'ram yang tak terp'ri
menurut k'hendakNya,
Hidup bagi Kristus, mati untung

Dulu hati dipenuhi dosa,
Sehingga Yesus datang s'lamat ku
Dia panggil aku pulang
dan bebas dosaku
Hidup bagi Kristus, mati untung

Ada perkara ku masih tak tahu
Tapi ini aku sungguh yakin
Dia panggilku hari itu
Dia suci dosaku
Hidup bagi Kristus, mati untung`,
    songNumber: 'D'
  },
  {
    id: 'D25',
    title: 'MARI YESUS SOBATKU',
    lyrics: `Mari Yesus sobatku
Penebus dan Bapaku
Ya kekasih jiwaku
Mari masuk hatiku

Yesus hatiku lemah
Datanglah bersegera
Hati aku berseru
Segarkanlah anakmu

Tak suatu apapun
Yang senangkan kalbuku
Hanya kasihmu teguh
Menggemarkan hatiku

Mari Yesus bapaku
Angkat aku anakmu
Lindungkanlah jiwaku
Dari setan lawanku`,
    songNumber: 'D'
  },
  {
    id: 'D26',
    title: 'KOTOHUADAN JESUS',
    lyrics: `Kotohuadan Jesus,
Id tanga ko tuhun
Tumanud zikoi,
Sontob k'ajalan nu

Kotohuadan Jesus,
Koluang za tavasi
Nakasambut no,
Tinan om Zaa Nu

Kotohuadan Jesus,
Id Misa diti
Dumandi zikoi,
Guminavo Diau`,
    author: 'Paul Kadau',
    songNumber: 'D'
  },
  {
    id: 'D27',
    title: 'TUHAN KOUNSIKAAN KU',
    lyrics: `Chorus: Tumanud ngaavi bunga humozou
Sanang ginavo ku
Paai po ngaavi nga munsikou
Tuhan oh kounsikaan ku

Vinängun tokou do Tuhan
Id upa dau sondii
Angatan tokou do Tuhan
Kumaa id kovosian

Kosusaan id koposizon
Mai tokou toguvango
Miampai do kotumbazaan
Pakaazan doid Tama

Ngaavi kalaja dagai 
Onuai zikoi balakat
Sundung kivaa kosusaan
Kanu mai do munsikou

Ngaavi layat Nu doiti
Migit kaajalan Nu
Iti no kaazaan Nu
Mantad dagai do-i-ti`,
    songNumber: 'D'
  },
  {
    id: 'D28',
    title: 'JESUS YUMIKOT KO',
    lyrics: `Jesus yumikot Ko,
Kinohoingan ku,
Ponobus mizon daa id ginavo ku
Jesus zou pisaya
Ngaavi do boos Nu 
Sambaon ku Jesus, Kinohoingan ku

Au zou mipadan do
Sumambut Diau
Tu hinumavan ou do Ginavo Nu
Tumongob ou nodii
Tu, do douso ku
Pohodongon Jesus, Kinohoingan ku

Nunu tahakon ku 
Do id Raja ku
Asampit kopizo zoui anak nu
Iti nopo Jesus 
Koduuduvo ku
Om inan ku nogi, nga, pataakon ku`,
    songNumber: 'D'
  },
  {
    id: 'D29',
    title: 'TINAN KU HIUNGAN',
    lyrics: `Tinan ku hiungan do Mononobus
Tombuhui ku daa tinan do Kristus
Zaà di Jesus ku ponodu do tuuh
Poduo zou do vaig id tobik nu.
Poduo zou do vaig id tobik nu

Linuo di Jesus higkango izou
Oi oomis Jesus, kinongoo izou
Id suang do ganit tutubai ikoi
Doiho zou nodii gisom apatai
Doiho zou nodii gisom apatai

Tambaai zou Jesus humavan logon
Ontok matai daa poohozo hongon
Hoovo zou nodii mongoi insavat
Mangazou koizo Kinoingan 'd savat
Mangazou koizo Kinoingan 'd savat`,
    songNumber: 'D'
  },
  {
    id: 'D30',
    title: 'OGINGO SAKRAMENT',
    lyrics: `Ogingo Sakrament hinosokon Kristus
Ih poinhosok doiti ginavo za oupus
Oi Jesus, tuhun, mokiinsian
Taako dagai kavasian
Ogingo Sakrament hinosokon Kristus

Ogingo Sakrament kataadaan do susa
Notuhuk kahandak mundoong ginavo za
Doiho Jesus kababasan
Doiho nogi kaanangan
Ogingo Sakrament Kataadaan do susa

Ogingo Sakrament banar koundangan
Koposizon tuhun doiti pisangadan
Oi Jesus, posizo zikoi
Noimaan do sangod izikoi
Ogingo Sakrament banar koundangan`,
    songNumber: 'D'
  },
  {
    id: 'D31',
    title: 'OI GINAVO DI JESUS',
    lyrics: `Oi Ginavo di Jesus
Hizabon sabap tuhun
Om sinuak do tandus
Noivang do id tuhun

Korus: Hozou ku minsavat ginavo di Jesus
Amu kotongkizad tuhun di notobus (2x)

Odoi dogo, nakaansau
Amu kosoou, Tuhan
Ahangas mokinoongou
Ponuu do Kinoingan

Pointapui Ginavo Nu
Mantad koginavaan
Ih ki douso togumu
Naanu kavasian

Atantu zou do baino
Zadaan ku douso ku
Mizon id suang ginavo
Di Jesus, Tuhan ku`,
    songNumber: 'D'
  },
  {
    id: 'D32',
    title: 'OOMIS GINAVO',
    lyrics: `Oomis Ginavo di Jesus, obinsianan
Om hizabon zikoi mokiinsian
Posimbano gianvo za tahangas
Toodoo no izonon do Kinoingan

Korus: Oi Jesus, Tuhan, insiano
Ginavo za, povosio

Oomis Ginavo di Jesus, ajalo
Zikoi do popoguno graasia Nu
Do minsavat ginavo za tataakas
Mantad tana mintong-intong Voos Nu

Oomis Ginavo di Jesus, pokito
Zikoi mimang suka Nu tomoimo
Manud-tanud Ginavo Nu selajur
Ontok ki hasa za, obiinsiano`,
    author: 'Belia Beaufort',
    songNumber: 'D'
  },
  {
    id: 'D33',
    title: 'YESUS SANJUNGAN KU',
    lyrics: `Khabar Baik sudah ku t'rima
Aku menyambut tubuhMu
Aku minum anggur, darahMu
S'bagai tanda kepercayaan Ku

Korus: Oh....Yesus, terangilah dunia ini
Dengan cintakasih Mu
Petanda Mu...di atas kayu salib,
oh Yesus

Kaulah petunjuk jalan benar,
Yang berliku kehendak sendiri
Ker'na hatiku ingin tetap
Kaulah tempat perlindunganKu

Atas salib Kau dipakukan
Ibunda lihat sengsaraMu
Air tangis bagaikan darah
Ku sanjung kemuliaanMu`,
    author: 'Belia Beaufort',
    songNumber: 'D'
  },
  {
    id: 'D34',
    title: 'TUHAN MENGETUK HATIMU',
    lyrics: `Tuhan telah mengetuk hatimu
Ia berkata "Ikutlah Aku"
Tinggalkanlah semuanya itu
Hidup kekal dijanjikan padamu

Tuhan Yesus telah menunggu
Orang yang berdosa
Disucikan oleh darahNya
Yesus penebus yang mulia

Korus: Janganlah kau menolak
KasihNya yang sangat indah
Datanglah padaNya
Dib'ri pengampunan
Tuhan t'lah mengetuk hatimu
Tuhan t'lah mengetuk hatimu`,
    songNumber: 'D'
  },
  {
    id: 'D35',
    title: 'YESUS DATANG PADA KU',
    lyrics: `Yesus datang padaku,
Segarkanlah imanku
Setiap hari kau melindungiku,
Yesus datang padaku

Yesus sinar hidup ku
Berikanlah Cahaya
Kepada diriku dalam kegelapan
Yesus datang pada ku

Yesus kekasih jiwaku
Kau penghibur jiwaku
Di waktu diriku dilanda derita,
Yesus datang padaku`,
    songNumber: 'D'
  },
  {
    id: 'D36',
    title: 'ORANG JEMPUTAN TUHAN',
    lyrics: `Korus: O Tuhan siapakah yang boleh 
menumpang dalam khemah Mu?
Siapakah yang patut berdiam 
di gunung suci Mu?

Mereka hidup yang tidak bercela
Yang melakukan apa yang adil
Yang berkata kebenaran dari hatinya
Yang tidak menyibarkan fitnah 
dengan lidahnya

Mereka baik terhadap temannya
Yang t'dak menimpakan cela 
pada tetangganya
Yang memandang hina orang yang 
tersingkir
Tapi memuji orang yang takut 
akan Tuhan

Mereka pegang sumpah walaupun rugi
Yang meminjamkan wang tanpa 
bunganya
Yang tak t'rima suap melawan orang 
tak bersalah
Yang buat demikian, tak 'kan goyah lagi`,
    author: 'Belia St. Anthony Tenom',
    songNumber: 'D'
  },
  {
    id: 'D37',
    title: 'BAHASA CINTA',
    lyrics: `Andaikan ku lakukan
Yang luhur mulia
Jika tanpa, kasih cinta 
Hampa tak berguna

Kor: Ajarilah kami bahasa cintaMu
Agar kami dekat padaMu ya Tuhan ku
Ajarilah kami bahasa cintaMu
Agar kami dekat padaMu

Andaikan 'ku fahami bahasa semua
Hanyalah bahasa cinta
Kunci tiap hati

Cinta itu, lemah lembut
Sabar sederhana
Cinta itu murah hati
Rela menderita

Andaikan 'ku dermakan segala milik ku
Tapi hanyalah cintaku
Sanggup memba'giakan`,
    songNumber: 'D'
  },
  {
    id: 'D38',
    title: 'SYUKUR TUHAN',
    lyrics: `Ref: Syukur Tuhan
Syukur padaMu
Atas rahmatMu
Untuk hari ini
Engkau perkenankan
Pesta bersamaMu
K'liling meja altarMu
Dalam Ekaristi

Mari kita mengikat cinta
Dalam perjamuan
Satu dalam Tuhan

Mari kita saling maafkan
S'gala kesalahan
Di antara kita

Mari kita di dalam doa
Memohon berkat Nya
Bagi kita semua`,
    songNumber: 'D'
  },
  {
    id: 'D39',
    title: 'TERANG HIDUP KU',
    lyrics: `Di dalam hidupku, Kasih ku nyatakan
Di dalam rinduku, Ku datang padaMu
Tuhan......pimpinlah langkah ku
Berilah t'rang hidup ku

Rindu ku, tanganMu, 
dan peluklah diri ku
Jiwaku s'lamatlah dari dosa nestapa
Tuhan tolong terang hidupku
Selamatlah, s'lamatlah jiwa ku

Korus: Kini hidup ku telah baru
Kerana kasihMu
Datanglah semua harapan,
Hilanglah penderitaan......
Tuhan.......tolong terang hidupku
Selamatlah, s'lamatlah jiwa ku`,
    songNumber: 'D'
  },
  {
    id: 'D40',
    title: 'MELAYANI LEBIH SUNGGUH',
    lyrics: `Melayani, melayani lebih sungguh 
Melayani, melayani lebih sungguh 
Tuhan lebih dulu melayani kepada ku 
Melayani, melayani lebih sungguh

Mengasihi, mengasihi lebih sungguh
Mengasihi, mengasihi lebih sungguh
Tuhan lebih dulu mengasihi kepada ku 
Mengasihi, mengasihi lebih sungguh

Mengampuni, mengampuni lebih sungguh
Mengampuni, mengampuni lebih sungguh
Tuhan lebih dulu mengampuni kepada ku 
Mengampuni, mengampuni lebih sungguh

Menghargai, menghargai lebih sungguh
Menghargai, menghargai lebih sungguh
Tuhan lebih dulu menghargai kepada ku 
Menghargai, menghargai lebih sungguh`,
    songNumber: 'D'
  },
  {
    id: 'D41',
    title: 'SEPANJANG JALAN',
    lyrics: `S'panjang jalan, hidup ada rakan setia 
la bersama dan pimpin perjalanan 
Damai dib'ri, gelap dijadikan terang 
Tuhan telah s'lamat jiwa ku

Korus: Walaupun susah payah perjalanan
Atas gunung dan lembah yang gelap 
Aku tahu Yesus ada di samping ku 
S'panjang jalan menuju bahagia

Ku tak mengerti kasihNya Tuhan dulu
Yesus disalibkan kerana aku
Ku percaya Dialah Jurus'lamat ku
Sejak itu Yesus di samping ku`,
    songNumber: 'D'
  },
  {
    id: 'D42(a)',
    title: 'BAPA KAMI',
    lyrics: `Bapa kami yang di syurga-
dimuliakan NamaMu
Datanglah kerajaanMu, 
mohon pimpinanMu
Semua akan terjadi,
menurut kehendakMu
Di syurga maupun di dunia,
Tuhan yang kuasa

Berkatilah hari ini,
Ampuni dosa kami
Kami juga mau mengampuni, 
dosa sesama kami
Mohon lindungilah kami, 
dari s'gala bahaya
Biar kami setia padaMu,
Bapa dengarkan kami`,
    songNumber: 'D'
  },
  {
    id: 'D42(b)',
    title: 'KU TAU TUHAN PASTI BUKA JALAN',
    lyrics: `Ku tau Tuhan, nanti buka jalan 
Ku tau Tuhan, nanti buka jalan
Kalau ku hidup suci, 
tidak ku turut dunia
Ku tau Tuhan, nanti buka jalan

Ku tau Tuhan, pasti buka jalan
Ku tau Tuhan, pasti buka jalan
Kalau ku ikut Dia,
tidak ku takut susah
Ku tau Tuhan, pasti buka jalan`,
    songNumber: 'D'
  },
  {
    id: 'D43',
    title: 'TOIMO NOH IH JESUS',
    lyrics: `Kinongoo noh diozu
Ih Jesus mokiivang
Mongotuk do vavazaan
Nokuo au ivangan?

Korus: Isai monoimo
Kaanu kounsikaan
Isai otumbazaan
Kaanu koposizon

Kinongoo noh diozu
Ih Jesus mokiivang
Id vavazaan ginavo
Nokuo au ivangan?

Ivango noh diozu
Vavazaan do ginavo
Toimoo noh ih Jesus 
Isido noh ih Tuhan

Ivango noh diozu
Vavazaan do ginavo
Sumuang ih Jesus 
Manaak kounsikaan`,
    author: 'Komuniti Katolik Terawi',
    songNumber: 'D'
  },
  {
    id: 'D44',
    title: 'TUHAN ADALAH GEMBALA KU',
    lyrics: `Tuhan adalah gembala ku
Tidak kekurangan aku, 
la membaringkan aku
Di ladang yang berumput hijau

Ког:la membimbing ku ke air yang tenang 
la menyegarkan jiwa ku
la menuntun ku ke jalan yang benar
Oleh kerana kasihNya
Sekalipun aku berjalan
Dalam lembah kekelaman

Aku tidak takut bahaya
Sebab la berserta ku
Gada-Nya dan tongkat-Nya 
Itulah yang menghibur aku`,
    songNumber: 'D'
  },
  {
    id: 'D45',
    title: 'ANAK ALLAH',
    lyrics: `Anak Allah Yesus namaNya
Menyembuhkan menyucikan
Bahkan mati tebus dosaku
Kubur kosong membuktikan
Dia hidup

Ku berjuang untuk mencapai
Pantai baka sebrang sana
Menang atas maut serta dosa
Bersama Yesus dalam 
kemuliaanNya

Ref: S'bab Dia hidup ada hari esok
S'bab Dia hidup ku tak gentar
Kerna ku tahu Dia pegang hari esok
Hidup jadi bererti s'bab Dia hidup`,
    songNumber: 'D'
  },
  {
    id: 'D46',
    title: 'SYUKUR',
    lyrics: `Syukur pada yang suci     )
Syukur segenap hati         )
Allah telah memberi          )
AnakNya........ Yesus         )2x

Kini....... yang lemah jadi kuat      )
Yang miskin jadi kaya                       )
Dimungkinkan oleh                          )
KasihNya.....                                       )2x`,
    songNumber: 'D'
  },
  {
    id: 'E1',
    title: 'TUHAN KOUNSIKAAN KU',
    lyrics: `Chorus: Tumanud ngaavi bunga humozou
Sanang ginavo ku
Paai po ngaavi nga munsikou
Tuhan oh kounsikaan ku

Vinangun tokou do Tuhan
Id upa dau sondii
Angatan tokou do Tuhan
Kumaa id kovosian

Kosusaan id koposizon
Maai tokou toguvango
Miampai do kotumbazaan
Pakaazaan doid Tama

Ngaavi kalaja dagai 
Onuai zikoi balakat
Sundung kivaa kosusaan
Kanu mai do munsikou

Ngaavi layat Nu doiti
Migit kaajalan Nu
Iti no kaazaan Nu
Mantad dagai do-i-ti`,
    songNumber: 'E'
  },
  {
    id: 'E2',
    title: 'PAPAAZOU ZOU DO TUHAN',
    lyrics: `Papaazou zou do Tuhan id nombo zou nopo
Miampai humozou zou popoiho do vokon
Napasi zou do Tuhan mantad salip Disido
Papaazou zou do Tuhan id nombo zou nopo

Sundung mozou-hozou zou, ogumu koimbazat
Koginavaan do Tuhan au toimoon
Tomoimo zou humozou do monongkotohuod
Papaazou zou do Tuhan id nombo zou nopo

Oi tobpinai kou ngaavi di nokoinsodu
Bahik no doid di Jesus Ih Koginavaan
Isido poingandad diau tadau koguhian nu
Papaazou zou do Tuhan id nombo zou nopo

Kanou kumaa id Tuhan Ih Koposizon
Poisoo oh ginavo id kotumbazaan
Tuhan iumon tokou id koposizon
Papaazoui zou do Tuhan id nombo zou nopo`,
    songNumber: 'E'
  },
  {
    id: 'E3',
    title: 'TUMANUD ZOU DIAU',
    lyrics: `Tumanud zou Diau, oi Tuhan Jesus
Tumanud zou Diau, oi Tuhan Jesus
Tumanud zou Diau, oi Tuhan Jesus
Tumanud zou Diau, tomoimo

Zadaan ku ngaavi doun pomogunan (3x)
Tumanud zou Diau, tomoimo

Au zou poduli sundung osusa (3x)
Tumanud zou Diau, tomoimo

Otumbazaan zou doid Diau tomoimo (3x)
Tumanud zou Diau, tomoimo

Kanou tumatap pointanud Jesus (3x)
Tumanud zou Diau, tomoimo`,
    songNumber: 'E'
  },
  {
    id: 'E4',
    title: 'KOLUANG TAVASI KO JESUS',
    lyrics: `Koluang tavasi ko Jesus
Papaampun ngaavi hasa
Iziau no oh monokodung
Mogovit kosusaan za
Odoi, songkuo di vinasi
Odoi, songkụo sinanang
Saviavi kosusaan
Oviton doid Kinoingan

Ogumu potuu koimbazat
Kivaa potu koiadan
Kada tokou koosizai
Oviton doid Tuhan
Isido koluang tavasi
Papagaan kosusaan
Jesus kalati omungkang
Oviton doid Kinoingan

Omungkang potuu oh tuhun
Avagatan kosusaan
Hansan no doid di Jesus
Oviton doid Tuhan
Sundung zadaan do koluang
Kumaa zou doid Tuhan
Id hongon Dau katampungan
Kaanu mai kababasan`,
    songNumber: 'E'
  },
  {
    id: 'E5',
    title: 'TADAU DO KOPONONGKOTOHUADAN',
    lyrics: `Tadau baino,
Timpu do koponongkotohuadan
doid Tuhan
Pibabasan doid dotokou

Ref: Kotohuadan doid Kinoingan
Om ingkaa daa do tikid tadau
Saviavi monongkotohuod

Tadau baino,
Timpu do kinotimungan
ngaavi do tuhun
Sabap Diau nokoikot

Mantad baino
Ondomon za tadau diti
Do soumul-umut
Kapantangan do Kinoingan

Ingkakat no
Om zadaai ngaavi sontob
Koimaan talaat
Invoguval pogiigizon

Ginovoon ngaavi
Ih sontob nakapakaus Dotokou
Pihahasan nobuuo no`,
    songNumber: 'E'
  },
  {
    id: 'E6',
    title: 'KOTOHUADAN DIAU OI TUHAN',
    lyrics: `Nopupusan nodii Misa tokou
Kotohuadan doid Diau oi Tuhan
Muhi tokou miampai munsikou
Kotohuadan doid Diau oi Tuhan
Kotohuadan doid diau oi Tuhan

Nonuan zikoi Diau vinakas
Mantad Boos Nu om Kosombutan
Muhi tokou miampai munsikou
Kotohuadan doid Diau oi Tuhan
Kotohuadan doid Diau oi Tuhan

Ovito tokou kounsikaan
Pasasadon kuma do vokon
Muhi tokou miampai munsikou
Kotohuadan doid Diau oi Tuhan
Kotohuadan doid Diau oi Tuhan

Tuhungo zikoi omungkang
Papasasad koginavan Nu
Muhi tokou miampai munsikou
Kotohuadan doid Diau oi Tuhan
Kotohuadan doid Diau oi Tuhan`,
    author: 'Fr. C. Piong',
    songNumber: 'E'
  },
  {
    id: 'E7',
    title: 'MENGIKUT JESUS',
    lyrics: `Mengikut Yesus keputusan ku
Mengikut Yesus keputusan ku
Mengikut Yesus keputusan ku
Ku tak ingkar, ku tak ingkar

Korus: Cari apa di dalam dunia
Cari apa di dalam dunia
Cari dunia tentu binasa
Cari Yesus yang penuh cinta.

Salip di depan dunia di bl'kang
Salip di depan dunia di bl'kang
Salip di depan dunia di bl'kang
Ku tak ingkar, ku tak ingkar

Walau sendiri tetap ku ikut,
Walau sendiri tetap ku ikut,
Walau sendiri tetap ku ikut,
Ku tak ingkar, ku tak ingkar`,
    songNumber: 'E'
  },
  {
    id: 'E8',
    title: 'DUNIA BUKAN RUMAHKU',
    lyrics: `Dunia yang fana bukanlah rumah ku,
harta ku di sana seb'rang langit biru,
Malaikat melambai di pintu yang cerlang
Dalam dunia yang gelap 'ku tak lagi senang

Chorus: Engkau Tuhan sahabat yang benar
Tiada seperti 'kau di dunia yang cemar
Malaikat melambai di pintu yang cerlang
Dalam dunia yang gelap
'ku tak lagi senang

Mereka menantikan 'ku di surga t'rang
Ku majulah terus dengan hati senang;
Ku tau yang tangan ku Tuhanlah yang pegang
Dalam dunia yang gelap 'ku tak lagi senang

Di neg'ri yang baka, di kanaan permai,
saudara seiman tak usah bercerai
Di sana nyanyi t'rus kaum saleh yang menang
Dalam dunia yang gelap 'ku tak lagi senang`,
    songNumber: 'E'
  },
  {
    id: 'E9',
    title: 'KESYUKURAN',
    lyrics: `Korus: Ah - Tuhan!
Tuhan pencipta kita sembah
Pada Tuhan yang Mahakuasa
Syukurlah kita, pujilah kita
Pada Tuhan yang Mahakuasa

Kerana mata hari,
Syukurlah kita pada Tuhan
Bintang dan bulan, syukurlah kita

Kerana sungai dan laut,
Syukurlah kita pada Tuhan
Burung dan ikan, syukurlah kita

Kerana sawah padi,
Syukurlah kita pada Tuhan
Pokok dan bunga, syukurlah kita`,
    songNumber: 'E'
  },
  {
    id: 'E10',
    title: 'MONONGKOTOHUOD ZIOY DIAU TUHAN',
    lyrics: `Kotohuadan Diau Tuhan za
Ngaavi sontob kovosian Nu
Muhi zioy id suhap papaazou Diau
Onuai zioy grasia om balakat Nu

Korus: Oi Tuhan Kinoingan za
Kotohuadan doid Diau
Gompizo om tungguvai zioy no
Guminavo zioy Diau selajur

Maazou no Ngaan Nu Tuhan za
Minamangun Ko do ngaavi
Tudukai zioy guminavo Diau
Ziau no Kinohoingan za

Azou Ama za Povozon
Sanctus Anak om Tuhan za
Oi Tuhan za Sangti Spiritu
Kazahan Kinoingan za`,
    author: 'Joseph Lansina',
    songNumber: 'E'
  },
  {
    id: 'E11',
    title: 'MARI SAUDARA GIAT BERSATU',
    lyrics: `Mari saudara giat bersatu
Roh Katolik menggemarkan hati
Sambil menaruh semangat baru
Kita pertahankan waris suci
Sediakan gaya tenaga
Agar kerajaan kasih menang
Tak kerana takut, kita boleh mundur
Wajib melindungi harta iman
Tak kerana takut, kita boleh mundur
Wajib melindungi harta iman

Dari cahaya Gereja Kudus
Hidup serani beroleh terang
Bangsa Katolik aman dan damai
Pertahankan jangan dan perang.
Dalam rumah, juga diluar.
Berikan Tuhan mu, hormat besar.
Tak kerana takut, kita boleh mundur
Wajib melindung harta iman
Tak kerana takut, kita boleh mundur
Wajib melindung harta iman`,
    songNumber: 'E'
  },
  {
    id: 'E12',
    title: 'YESUS PENOLONG SETIA',
    lyrics: `Oh Yesus penolong tiada yang lain
Ku diangkut dari lembah lumpur dosa
Ku serahkan seluruh hidup padaNya
Hidup penuh sukacita didalam Tuhan

Korus: Kini ku milik Tuhan
Derita ku diangkutNya
Janji Tuhan selalu digenapi
Ku yakin jiwa ku selamat

Ku berserah pada Yesus dalam hidupku
Yesus selalu memanggil umat yang sesat
Jangan tolak kasihNya yang sangat indah
Anak Yesus penuh dengan
Roh kesucian`,
    songNumber: 'E'
  },
  {
    id: 'E13',
    title: 'ALABARE',
    lyrics: `Ref:  Alabare. Alabare, Alabare Tuhan Ku

Yohanes melihat yang diselamatkan
Semua memuji Tuhan Allah
Ribuan berdoa, laksaan bersorak
Semua memuji Tuhan Allah

Tiada Tuhan seagung Dikau,
tak ada, tak ada
Tiada Tuhan seagung Dikau,
tak ada, tak ada
Tiada Tuban yang amat kuasa
Seperti Allah kita
Tiada Tuhan yang amat kuasa
Seperti Allah kita

Tanpa pasukan serta senjatanya
Namun dengan kuasa Roh Kudus
Tanpa pasukan serta senjatanya
Namun dengan kuasa Roh Kudus
Gunung pun akan dipindahkan
Gunung pun akan dipindahkan
Gunung pun akan dipindahkan
Oleh kuasa Roh Kudus

Dan gerejaNya akan selamat (3X)
Oleh Kuasa Roh Kudus`,
    songNumber: 'E'
  },
  {
    id: 'E14',
    title: 'HALLELUYAH',
    lyrics: `Kor: Puji Halleluyah,Puji Halleluyah
Puji Halleluyah, Puji Halleluyah
Puji Halleluyah, Puji Halleluyah
Agungkan NamaNya
Masyurkan Rajamu

Mari masyurkan dan puji NamaNya
Yesus penuntut hidup yang teguh
Yang bebaskan kita dari segala dosa
Terpuji NamaNya selama-lamanya.

Yesus 'kan datang dalam kemuliaan
Menyambut kita yang diselamatkan
Kita 'kan bahagia bersama di surga
Memuji Yesus selama-lamanya`,
    songNumber: 'E'
  },
  {
    id: 'E15',
    title: 'EKARISTI SUMBER KEHIDUPAN KITA',
    lyrics: `Syukur Tuhan cinta kasihMu
Puji Yesus kehadiranMu
Ekaristi warisan kasihMu
Korban kudus Tubuh dan DarahMu

Syukur Tuhan kami rayakan
Ekaristi perjamuanMu
Roti dan anggur santapan hidup
Tubuh dan DarahMulah jadinya

Korus: Mari semua mari kita bersatu
Hayati bersama cinta kasihNya
Sedari bersama kehadiranNya
Ekaristilah menjadi tandaNya

Syukur Tuhan sabda dan TubuhMu
Sumber kehidupan bagi kami
Kau serahkan diri untuk kami
Bagi kami santapan kehidupan

Syukur Tuhan bersatu denganMu
Senantiasa berserta kami
Ekaristi cinta kasihMu
Santapan sepanjang hayat kami`,
    author: 'Fr. C. Piong',
    songNumber: 'E'
  },
  {
    id: 'E16',
    title: 'OIKARISTIA TOVUD DO KOPOSIZON TOKOU',
    lyrics: `Kotohuadan do koginavaan Nu
Aazou ko oi Jesus tu miampai dagai
Oikaristia pinotungkus Nu dagai
Kohubukan do Tinan om Zaa Nu

Kotohuadan miampai lamazon za
Dikaristia, pamakanan Nu
Louti om Anggur takanon koposizon
Adadi do Tinan om Zaa Nu

Korus: Kanou no ngaavi kanou misompuu
Posizo tokou oh koginavaan Dau
Ihoo tokou oh kaampazan Dau
Oikaristia no kointahangan Dau

Kotohuadan di Boos om Tinan Nu
Tovud koposizon montok dagai
Tuminaak ka sondii doid dagai
Takanon koposizon montok dagai

Kotohuadan kopiiso zikoi Diau
Miampai ko dagai tomoimo
Oikaristia koginavaanNu
Takanon za sohinaid do poimpasi`,
    author: 'Fr. C. Piong',
    songNumber: 'E'
  },
  {
    id: 'E17',
    title: 'ABAL TAVASI MONTOK DIAU',
    lyrics: `Id vinoun poimpasi tokou miaga nipi
Poimpasi do mogohos nopo
Monompogunan doiti id vinoun
Nombo di oh pakaazan?

Kounsikaan om nogi koiadan avazaan
Piintutunan mogovit kounsikaan
Pitongkizadan mogovit koiadan
Isai di oh koinsasamod?

Chorus: Naka-abal nangku Abal Tavasi doid diau
Pason di Jesus ih kapamasi dotokou
"Izou noh ih Louti di kapasi" ka Dau
"Lahan, Katapatan, Koposizon".

Id koposizon ogumu au tokou olotian
Aiso kaanu manaak kasantaban
Ginavo houson om tuuvan tomoimo
Isai di oh sondion tokou?

Id koposizon ogumu mikot
koimbazatan ngaavi
Kaangat dotokou kumaa koundasaan
Popoinsodu mantad katapatan
Nombo pogiuman kounsikaan?

(Chorus)

Id koposizon pointanud, poingampai ih Jesus
Kanou intu-tunai tokou Isido
Maza di Boos om Oikaristia Dau
Poingkaa nogi id koposizon`,
    author: 'Fr. C. Piong',
    songNumber: 'E'
  },
  {
    id: 'E18',
    title: 'MAJU BERSAMA',
    lyrics: `Marilah saudara melangkah maju,
Tuhan serta kita
Sepanjang jalan penuh liku,
Tuhan serta kita

Maju bersama, bersatulah kita
Maju dalam cahaya....
Maju bersama satu harapan kita
Hidup Kristus jaya 
Alleluia, Alleluia,                                   )
Hidup Kristus nan jaya                        )2x`,
    songNumber: 'E'
  },
  {
    id: 'E19',
    title: 'BERSATULAH KITA',
    lyrics: `Bersatulah kita sekutu
Agama Gereja yang kudus
Didalamnya kita setuju
Dihantarkan iman tulus

Kristus penganjur kita
Pandu penunjuk jalan
Kita maju dengan gembira  )
Biar jalan berintangan         ) 2x

Iman kita tidak berubah
Dari sesat terhindarkan
Bagi orang abad semua
Pedoman di kehidupan`,
    songNumber: 'E'
  },
  {
    id: 'F1',
    title: 'TINA ZA DO KOUPUSAN',
    lyrics: `Maria Tina za do koupusan
Sambayangai zikoi ih anak nu
Kada do koinsodu mantad Tuhan
Kada do koinsodu mantad diau

Chorus: Oi Maria oi Tina za
Kada zikol diau insudai
Gisom no ma do soumul-umul
Masi id koginavaan nu

Ontok do kalavong koposizon
Ontok do oikatan ponginaman
Oi Maria tina do koupusan
Zikoi i anak nu tuhungo

Ovito zikoi no do minsomok
Kumaa di Jesus ih Tuhan za
Pavakaso kotumbazaan dagai
Tumanud di Jesus ih Tuhan za`,
    author: 'Fr. C. Piong',
    songNumber: 'F'
  },
  {
    id: 'F2',
    title: 'HAAHANGAI TATAAKAS',
    lyrics: `Haahangai tataakas, oi Tina taazou
Tuhan za nosusu mantad no Diau
Noontok zikoi, tanak Nu, do kosusaan
Id koginavaan Nu zikoi humansan

Korus: Ave, Ave, Ave Maria
Ave, Ave, Ave Maria

Kaansau motuu doiti zikoi no touvi,
Sabap oimbazat no do logon ngaavi
Isai-sai migit po do kotumbazaan
Id kosianan Nu zikoi humansan

Minintong Kinoingan konitingan Nu
Tu aiso hasa Nu om au nakaanu
Logon do migit do koduuduvo Nu
Katapi doun Tuhan Ko ngaavi tadau`,
    songNumber: 'F'
  },
  {
    id: 'F3',
    title: 'PAPAAZOU ZOU DO TINA',
    lyrics: `Papaazou zou do Tina do
Kinoingan tokou,
Ih haahangai tabantug ih raani ku taazou
Ajalo zou, oi Raani do mangazou Diau

Korus: Ganti do tuhun ngaavi,
Ih haid no nakaansau

Oi bunga Ko togingo, avanus ko tadau
Aiso no do pointahib,
vinanus doun Diau
Tumbozo zou mamantang om
mangazou Diau,

Nung 'tankangau zou toomod,
om adahaan susa,
Om panavau do lahan,
oi tombituon za
Om hobi po hizab ku
do mangazou Diau`,
    songNumber: 'F'
  },
  {
    id: 'F4',
    title: 'RAANI DO SURGA',
    lyrics: `Raani do surga, oi Tina
Miad ih tanak Nu doiti
Pointanga zou di tosusa
Logon mogimbaazat nogi
Tina do Kristus, tuhungo
Sambayangai zou kopizo

Avasi Ko om ataakas
Tuhun ki douso izikoi
Aiso do guno tahangas
Kaansau nopo, nung sompopoi
Sabap ingato, Tina ku
Do au kaansau ih Tanak Nu

Koikot zou mogimpapatai
Om potuubung do Kinoingan
Ingato zou, kada hiivai
Nung songuhun, isai kataan
Tina do Kristus, tuhungo
Id surga izou ovito`,
    songNumber: 'F'
  },
  {
    id: 'F5',
    title: 'KOTUHUNGAN TOKOU',
    lyrics: `Kotuhungan tokou, Raani di'd savat,
Haahangai totinud, Tina 'tozu,
Pokionuo guno do tombiivo
Mongob-tongob sabap ngaavi douso

Tina do Kinoingan, kounsikaan za
Kaanangan do Tasab puun no Iziau
Pokionuai zikoi tosusa
Kada hivai, Tina, Tanak ih Diau

Haahangai indama, Tina Kristus,
Kaanu Ko kasianan mantad Jesus
Pokionuo ontok do matai
Songodo logon mingkakat idoos`,
    songNumber: 'F'
  },
  {
    id: 'F6',
    title: 'AVE MARIA, OI BAZAD',
    lyrics: `Ave Maria, oi Bazad, suupu do Tuhan,
Pinsuibo no ginavo nu,
puun do konitingan

Miad do guminavo ko,
do uhun do vokon
Pingkaa ou daa, oi inde ku,
koginavo d'uhun

Asampit anak nu Jesus,
id kampong Bethlehem
Amu poogi ginavo ku,
id kotos dumokot

Oi Maria, pokinsian do anak nu Jesus
Zioi nogi mumbozo daa,
miad do Ponobus`,
    songNumber: 'F'
  },
  {
    id: 'F7',
    title: 'MINSOMOK SODOP DO MOINO',
    lyrics: `Minsomok sodop do moino
Kotonob nodii adau
Oi Maria kinongoho
Sambayang ku id diau
Inde Sangte, gompizo no
Nitungan om gaab ku
Tompungo nogi ombiivo
Om inan do anak nu

Noundoso haid kopizo
Oi inde, ginavo nu
Iti no sabap tuhungo
Id susa ih anak nu
Raani ku, mantad id avan
Pokuato ginavo ku
Tumagak do kaharapan
Id diau kaazaan ku

Ih Inde do anak Jesus
Tina do Kinohoingan
Pomihoo nogi doid Jesus
boos ku do kosusaan
Om mantad do Kinoingan
Sumondot daa graasia zo
Doid tanak nu do id tana
Mouhagang ginavo zo`,
    songNumber: 'F'
  },
  {
    id: 'F8',
    title: 'OI MARIA, OI TINA ZA',
    lyrics: `Oi Maria, oi Tina za
Banar kounsikou
Saviavi ginavo za
Diau do mamantang
Om humozou ngaavi zikoi
Id kalamazan za

Korus: Sabap aiso do douso ko
Oi Raani za, oi Raani za

Mamalamai nogi doiho
Id surga malaikat
Om tuhun sangti ngaavi no
Diau papasavat
Om mamung nogi zosido
Id kalamazan za, Sabap ais.....

Amu po kokito diau,
Om ngaavi kazaan nu,
Tu kokilouan do tadau
Dadi pakazan nu
Makin po humozou zikoi
Om lamazon za daa,
Sabap aiso.....`,
    songNumber: 'F'
  },
  {
    id: 'F9',
    title: 'TINA DO KINOINGAN',
    lyrics: `Tina do Kinoingan, Diau kavanusan
Ngaavi kavasian doun no Diau 
Diau pataakon za, ngaavi ginavo za, 
Tinan om ngaavi daa ih doun dagai.
Diau tomoimo mantad do baino, 
Ngaavi zikoi no ih tanak tuhun, 
Ontok poimpasi om poinsuang hungun

Sabap konitingan om do koginavaan
Di koduuduvo Nu, oi Tina za.
Oi Kinoingan tokou minonuu Tanak Dau
Dumadi tanak Nu, oi Maria.
Om poozoon Ko di Voovozoon po, 
Spiritu Sangti ih poinsuang Diau 
Miampai ngaavi kavasian Dau.

Om nopihi Ziau do Kinoingan tokou, 
Dumadi tina za tu osusa.
Koumohigan poogi, kotundunan nogi, 
Oi Maria, Ko id ngaavi dagai.
Intaai zikoi daa id kosusaan za, 
Tina togingo Ko, kada hivai 
Do manampung om gussompi dagai.`,
    songNumber: 'F'
  },
  {
    id: 'F10',
    title: 'MENGASIH MARIA',
    lyrics: `Mengasih Maria, kerinduanku
Berhamba padanya, janjian teguh 
Aku mau menambah kemuliaanmu,
Kini dan selalu niatku sungguh.

Maria pemurah dan Ratu besar, 
Terima kiranya citaku benar.
Engkaulah Bundaku aku anakmu,
Yang suka dipandang harta milikmu.

Mengingat selalu kebajikanmu,
Menirunya juga niat hatiku
Tak kita bercerai di medan perang
Sehingga bersama kita 'kan menang.`,
    songNumber: 'F'
  },
  {
    id: 'F11',
    title: 'MARIA BONDA PERDAMAIAN DAN SAKSI IMAN GEREJA',
    lyrics: `Allah memilih Maria
Dari antara wanita
Yang disebut terberkati 
Yang penuh rahmat Tuhan
"Aku hamba Tuhan" Maria menjawab
Jadilah pada ku menurut perkataan Mu"
Lahirlah Bonda Allah

Chorus: Salam Maria
Hidup dalam Roh Kudus
Melalui puteraMu Yesus
Engkaulah Bonda Perdamaian
Dan saksi Iman Gereja

Keibuan Maria S'rah diri kepada Allah
Sehingga akhirnya ia hidup
Dalam Kristus PuteraNya
Kristus sumber perdamaian abadi
Benarlah Maria, Bonda Perdamaian
Mengikut kehendak Tuhan

Penuh harapan Iman
Maria nantikan Roh Kudus
Bersama Gereja Yesus
Di Kota Yerusalem
Lagi di Kana, menunjukkan teladan
Saksikan Iman Gereja`,
    author: 'Belia Bundu Tuhan',
    songNumber: 'F'
  },
  {
    id: 'G1',
    title: 'KUDUS, KUDUS, KUDUS, KUDUS',
    lyrics: `Kudus, Kudus, Tuhan Mahakuasa, 
Ku angkat tangan padaMu bagaikan 
kasihku,
Kudus, Kudus, Kuchis, Kudus.

Roh Kudus, Roh Kudus,
Segarkanlah hatiku, Roh Kudus, 
Ku teguh hati, padaMu bagaikan 
Kasihku, Roh Kudus, Roh Kudus.

Alleluya, Alleluya, Alleluya 
Alleluya, Ku serah jiwa padaMu 
Bagaikan kasihku, Alleluya, Alleluya`,
    songNumber: 'G'
  },
  {
    id: 'G2',
    title: 'KITA SATU DALAM ROH',
    lyrics: `Kita satu dalam Roh, satu dalam Tuhan 
Kita satu dalam Roh, satu dalam Tuhan 
Dan bersyukur semua'kan dijadikan baru

Korus: Saling kasih mengasihi sesama kita
Orang lain kenal kita anakNya

Kita jalan bersama, jalan serta Tuhan 
Kita jalan bersama, jalan serta Tuhan 
C'ritakanlah tentang kedatangan Almasih

Kita kerja bersama, kerja bagi Tuhan 
Kita kerja bersama, kerja bagi Tuhan 
Menolong jiwa orang yang masih dalam gelap

Pujilah Allah Bapa, Ker'na anug'rahNya 
Dan bagi Yesus Kristus Anak Tunggal Bapa 
Pujilah Roh Kudus yang mempersatukan kita`,
    songlabel: 'We are one in the Spirit',
    songNumber: 'G'
  },
  {
    id: 'G3',
    title: 'KINOINGAN NO IH KOGINAWAN',
    lyrics: `Kinoingan no ih koginawan 
Manahak ponuan guminawo 
Sawiawi tulun nga alapon 
Masi doid koginawan diti 

Oi Tuhan mantad tadau baino 
Tu noukab nodi ginawo ya 
Koginawan ya kumaa id Diau 
Pointalangon dagai id karaja ya

Ogumu ih marisau-ansau 
Mogigiyon id kotuwangan 
Ingaa komoyon do koposizon 
lyolo no ih tulungon ya 

Winakas Nu pokionuon ya 
Pogiroto no id koginawan 
Tudukai zikoi no do ralan 
Popointalang koginawan Nu

Tumimpuun izikoi no baino 
Poposonong ngaawi karaja ya 
Sumasi do koginawan Nu 
Kumaa doid tuhun ngaawi`,
    author: 'Belia St. Theresa Tambunan',
    songNumber: 'G'
  },
  {
    id: 'G4',
    title: 'KANOU VOOVOZOON SPIRITU',
    lyrics: `Kanou, Voovozoon Spiritu
Ginavo za tombuhuzo 
Ponuo dagai do graasia 
Ih minonoodo kuasa Nu

Tu Pinangasi id Diau
Tuntuu Ko hongon do Tama
Pinidandian du Tama
Tuhungo diha do moboos

Igitai ginavo tokou 
Potuboho koginavaan 
Katabazan taako dagai 
Ontok tinan za osusa

Sangod poiduo id sodu 
Om sanang zikoi ingkaa 
Do mamanau id kavasian 
Om aiso nodii hasa za`,
    songNumber: 'G'
  },
  {
    id: 'G5',
    title: 'TUHUNO SANTE SPIRITU',
    lyrics: `Tuhuno Sante Spiritu
Kozouo dahai do ginavo, 
Om ponuo no grasia, 
Do ginavo vinangun nu

Ziau, e monginsasamod
Om nitahak do Ama za 
Anak do pinijonjian,
Zioi no mokiinian

Patahango do ombivo, 
Tahako koginavaan,
Om ginavo amu tatap
Do grasia nu popanggo

Ngavi yogon poiduon,
Om katanangan minsomok
Nung moguhu ko zioi no, 
Amu kontok do ayaat 

Id kinohoingan, Ama za, 
Om miamung do Anak zo, 
Om hagi Sante Spiritu 
Id toun ngaavi gloria, Amen`,
    songNumber: 'G'
  },
  {
    id: 'G6',
    title: 'OI KINOHOINGAN SPIRITU',
    lyrics: `Oi Kinohoingan Spiritu
Ponuo no ginavo za, 
Do grasia om kavassa nu, 
Povossio ombivo za 
Povossio ombivo za

Koinsasamadan ziau
Do ngaavi uhun nosusa, 
Pun do koginavan, ziau 
Pamangun do nyava za 
Pamangun do nyava za

Mantad do grasia nu nopo
Oi Tuhan Sante Spiritu, 
Komiho oi do Ama po, 
Do Anak nogi, e Kristus 
Do Anak nogi, e Kristus`,
    songNumber: 'G'
  },
  {
    id: 'G7',
    title: 'KINOHOINGAN SPIRITU',
    lyrics: `Kinohoingan Spiritu
Tuhan do ngaavi navau
Panavao uhun nu
Kano Ama do uhun

Oviton no kotos nu; Kano doid anak nu 
Oi koinsasamadan Do ginavo d'avagat

Kano id dahai, Tuhan 
Oviton katangan; Tahako kosogitan
Ontok ki kohossuan

Hingoso no ganit za;
Om do grasia nu, Tuhan,
Pokuato ginavo za
Ompuno no douso za

Tuduko no yahan nu, Do amu oi kasadu
Ovito doid uhun, E sumamba do diau

Tu no katahakan nu, 
Tuhungo no ngavi oi;
Ontok jam do apatai, 
Sorga tahako dahai`,
    songNumber: 'G'
  },
  {
    id: 'G8',
    title: 'OI RAJA KO, DO KAAZAAN',
    lyrics: `Oi Raja ko do Kaazaan apasi Ko vagu
Zikoi nogi kahampai daa 
doiho id kaazaan nu

Id surga tumakad ko no 
do moguhu dagai
Katanud daa zikoi diau 
id surga d'alamai.

Nokoikot ko, oi Spiritu, 
do monginsasamod;
Ginavo za do graasia nu, 
ponuo no dagai`,
    songNumber: 'G'
  },
  {
    id: 'G9',
    title: 'KOBONTUGAN DOID TUHAN KINOINGAN',
    lyrics: `Oi Tuhan Kinoingan ku
Doid suang ginavo ku
Momusou di vinangun Nu ngaavi 
Okito ku iho tombituon doid tavan
Ongou ku iho hakun doid daat
Popointahang ngaavi iti do kuasa Nu

Choros: Papaazou zou do Tuhan Kinoingan ku
Adaha'an do kuasa Dau
Potihombus oh kopodulian Dau
Tomoimo miampai dogo
Kobontugan doid Tuhan Kinoingan

Oi Tuhan Mama-masi
Agazo koginavaan Nu
Au zou ii maa daa mipadan.
Nga poikoto Nu no kozo li Tanak Nu
Id salip minatai sabap dogo
Do kaanu di do koposizon s'lajul

Oi Tuhan Ih Raja ku
Baino id Diau zou nodii
Pomuginavan om pogiigizon ku
Katanud daa ngaavi gisom
kaandak Nu
Doid Diau zou matai id
kokuasaan Nu`,
    author: 'Fr. W. Poilis/Justin Lusah',
    songNumber: 'G'
  },
  {
    id: 'H1',
    title: 'ADA SERU KEDENGARAN',
    lyrics: `Ada seru kedengaran
Menimbulkan pengharapan
Terbitlah bintang cemerlang 
Gemilang, berterang-terang

Diutus Bapa AnakNya 
Mengambil dosa dunia 
Hai manusia bangunlah
Tebusan tiba segera

Pencipta alam dunia
Sudi bertubuh makluknya
Seliranya membebaskan
Selira yang ditewaskan

Kepada Bapa pujian 
Permuliakan Putera
Roh Kudus pun terpujilah
Pada selama-lamanya
Amen`,
    songNumber: 'H'
  },
  {
    id: 'H2',
    title: 'SALAH SANGKA',
    lyrics: `Masa dulu aku sangka 
Hari Natal pesta pora
Tak ada lain makan minum 
Lenggang-lenggok sini sana

Sepanjang ta'un tak bertujuan
Sama sekali tak teringat
Tuhan telah jadi manusia
Apa sebab tak tau langsung

Chorus: Oh Teman henti sebentar
Cubalah nikmati Tuhan 
Dia datang ke dunia ini
Kerna kau Dia korban diri

Sejak aku kenali Tuhan
Apa sebab Dia mati disalip 
Sedarlah aku apakah Natal 
Sebenarnya adalah Paska

Tuhan kata ikutlah Aku
Lupakan diri bangkit hidup
Mengasihi melayani
Menghayati Natal Paska`,
    author: 'Belia Bundu Tuhan',
    songNumber: 'H'
  },
  {
    id: 'H3',
    title: 'SODIA NOH !',
    lyrics: `Oi Tobpinai ku ngaawi
Insaru tokou nah korongou
Posodiao noh sirung pogulu rumasam 
Kada kogugu poh'm tumingaha nogi
Osonong do poinsodia toririmo

Somok duo noribu toun nakatalib
Ih Jesus Kristus tanak Kinoingan 
Minoboros kumaa di tutumanud Da
Do sumodia toririmo
Sabap kopupuson pomogunan
ingga koilo

Choros: Sodia noh, Sodia soh, 
Oi tobpinai ngaawi
Sodia moh

Iti noh pononsunudan di Jesus 
Minomoguno susuyan paagalan
Soira'd mogomulok tuntu'd guas ara
Oilaan diu rumikot tadau anaru
Osonơng do mumbangan-bangan kou

Duo poh kaagu susuyan paagalan Dau 
Koiso duo surupu araat om osonong
Koduo pasal dii kosumandakan
Ih otorodok om ib basug
Lobi sonong poinsodia toririmo`,
    author: 'Bella Bundu Tuhan',
    songNumber: 'H'
  },
  {
    id: 'H4',
    title: 'NUPUS MANTAD ID SURGA',
    lyrics: `Koinsasamadan dii sontob langadon
Solilinaid mogihum katapatan
Baino nokogirot noh ih piandad-andad 
Ih Jesus noh Nupus mantad id Surga

Cho:  Tuhan rumikot miampal kosianan Dau
Id tanga do tulua popotunud do ralan
Ralan totopot kumaa id koposion
Koposion tosonong om sogigisom

Sundung osodu tokou mantad id Tuhan
Toririmo ih Dau mandad-andad dati
Ukabo noh ginawo monorimo Disio 
Onuai Isio tionon id ginawo nu

Kolingasan oiton di Jesus id ginawo nu 
Miampai popomogot do koposion nu
Tu nokito Disio sontob kosusaan nu 
Ih au aanu momolingos sondiri`,
    author: 'Belia Bundu Tuhan',
    songNumber: 'H'
  },
  {
    id: 'I1',
    title: 'NOUNSIKOU',
    lyrics: `Nounsikou ngaavi tokou
Tu sodop baino no, 
Nosusu oh Tuhan taazou
Ih Mamasi ngaavi tokou
Jesus ih Raja Vozoon
Jesus ih Raja Vozoon

Nounsikou ngaavi tokou
Tu tasab popoiho
Baino abal tavasi toomod
Totuvong zu nokotingkod
Nokoimbuhai ih tadau
Nokoimbuhai ih tadau

Nounsikou ngaavi tokou
Tu moou-soou ngaavi no
Koikatan do Kinoingan
Naangatan do koginavaan
Kumaa doid tanga tuhun
Kuman doid tanga tuhun`,
    songNumber: 'I'
  },
  {
    id: 'I2',
    title: 'ID SUANG JERUSALEM',
    lyrics: `Id suang Jerusalem 
kouhagang om papaazou
Ngaavi tuhun tavasi

Nokoikot no, nokoikot no, 
Nokoikot no, nokoikot no, 
Jesus, Tanak di Maria

Kanou oi tanak ngaavi
Humozou do papaazou
Tu nosusu ih Raja, Nokoikot......

Isido mantad surga
Nokoikot do monobus
Au tokou daa kaansau. Nokoikot.....`,
    songNumber: 'I'
  },
  {
    id: 'I3',
    title: 'NOSUSU NO OH TUHAN',
    lyrics: `Nosusu no oh Tuhan
Mooi daa izikoi samba,
Tanak diti tonini
Koikot mantad surga
Oi Jesus totuzu
Biio zikoi no ih
Sumamba kaazaan Nu

Profet Nu zi Mikias
Kiboos pasal Diau
Osusu iso Tanak,
Id Bethlehem, ka dau
Iti zi Manuel
Momorinta maai ngaavi
Tuhun do Israel

Baino nopo oi Jesus
Notuhuk ngaavi ii
Kivaa dagai do raja
Poinghuvi id laami
Kaazaan Nu poinsurga
Zinadaan Nu do kaanu
Daa do ginavo za.`,
    songNumber: 'I'
  },
  {
    id: 'I4',
    title: 'TANGA SODOP DO OTUVONG',
    lyrics: `Tanga sodop do otuvong
Do id tana kaazaan
Do Tanak Kinoingan za
Mokidadi tadi za

Chorus: Ave Jesus, Raja za
Ngaavi kou bumozou daa
Doiho id Jerusalem
Om vagu id Bethlehem

Ih pamangun do tavan
Doiti id susumadan
Iti no huhuvizon
Do Tuhan ih Vovozoon.

Ziozu ih mintamong,
Om gumompi do panon 
Kanou no mongoi intong
Do Tanak ih Vovozoon.

Jesus Kristus Tuhan za
Pohosuo ginavo za
Ngaavi koginavo daa
Doid Diau om Maria`,
    songNumber: 'I'
  },
  {
    id: 'I5',
    title: 'KANOU TUNUN DO ABANAR',
    lyrics: `Kanou tuhun do abanar
Munsikou kou ngaavi
Ongoi no, ongoi no doid Bethlehem
Intangai ih nosusu
Raja do Malaikat
Kanou sumamba tokou (3x)
Do Tuhan za

Do mooi ponobus dagai
Kinoingan om tuhun
Poingizon id tinan di Maria
Kinoingan ih nosusu
Okonko vinangun
Kanou sumamba tokou (3x)
Do Tuhan za

Diau Tuhan, sumamba zikoi
Nosusu tadau diti
Id Diau, oi Jesus kobontugan
Kapantangan id savat kozo
Kanou sumamba tokou (3x)
Do Tuhan za`,
    songNumber: 'I'
  },
  {
    id: 'I6',
    title: 'ZISAI MOTUU ANAK DITI',
    lyrics: `Zisai motuu Anak diti
Pinhuvi nopo id hami?
Susumadan di hami?
Do Kinohoingan Povozoon
Do Kinohoingan Povozoon

Zisai ih ondu d'osuau,
Pinsingkotud do hiho no?
Maria, ngaan zo kitua
Inde do Kinohoingan za
Inde do Kinohoingan za

Zisai kusai mohoing no di,
Ih mingkakat hiho nogi?
Zi Joseph ih do abanar
Uhun do otuhid banar
Uhun do otuhid banar

Nunu sabap do okilou,
Susumadan, miad d'adau?
Haho nogi kogumuan
Malaikat ngaavi do Tuhan
Malaikat ngaavi do Tuhan`,
    songNumber: 'I'
  },
  {
    id: 'I7',
    title: 'TOHU RAJA IZIKOI',
    lyrics: `Tohu Raja izikoi, mantad id kohisaon
Tumakad do nuhu
Tumanud do tombituon

Korus: Ninavau do kohoiran
Ninavau di doun Raja
Ovito zikoi do id ninavau Nu
Doid tosuau

Nosusu ih Raja ku, mogovit izou amas
Raja Ko selajur
Momorinta doid dagai

Kamazan pohubukon id kapantangan Diau
Sambayang doid kamazan
Sumamba doid savat`,
    songNumber: 'I'
  },
  {
    id: 'I8',
    title: 'MOZOU-HOZOU OH MALAIKAT',
    lyrics: `Mohou-hozou oh malaikat
Abal Tavasi toomod
Nokoongou ih gugumompi
Hozou diti togingo
Ka...pantangan id savat kozo
Ka...pantangan id savat kozo

Id somok tazam poinhuvi
Ih Jesus kosuususu
Aiso no do todopon Dau
Sundung tu do Kinoingan

Oi mimintamong kou ngaavi
Nokuo tu angalamai
Nokuo tu mooi saviavi
Kumaa id susumandan?`,
    songNumber: 'I'
  },
  {
    id: 'I9',
    title: 'OI TANAK JESUS',
    lyrics: `Oi Tanak Jesus tobitua
Tumaak zikoi doid Diau
Miaga Diau, tu guminavo
Do tuhun, ingkaa dan izikoi

Korus: Iziau no Jesus, Raja za
Do baino, om selajur so!
Iziau no Jesus, Raja za,
Do baino om selajar no!

Diau no ngaavi k'laja za
Om sontob kosusaan za
Kasanangan om kounsikaan
Pataakon za ngaavi Diau

Balakatai zikoi, Jesus
Om ngaavi ginovoon za
Jesus, ih popibabas kozo
Pataako dagai kavasian`,
    songNumber: 'I'
  },
  {
    id: 'I10',
    title: 'ANAK YESUS DILAHIRKAN',
    lyrics: `Dend: Anak Yesus dilahirkan
Cuba gembala lekas bersuling!
Anak Yesus dilahirkan
Yang membawa perdamaian

Di lembah dekat Bethlehem
Sudah turun malaikat gilang,
Yang di padang mendapati
Kawal domba yang tercengang

Jangan takut, bergirangiah
Kamulah yang dipilih Allah
Pergi pandang di kandangNya
Yang menjadikan dunia`,
    songNumber: 'I'
  },
  {
    id: 'I11',
    title: 'SAUDARA KEMARI DAN BERSUKACITA',
    lyrics: `Saudara kemari dan bersukacita
Berbangga berlari ke Bethlehem
Lihatlah Anak, Raja isi surga

Dend: Kemari sembah, sujud.
Kemari sembah, sujud
Kemart sembah, sujud Tuhanmu

Meninggalkan domba larilah gembala
Mendapatkan Yesus di kandangNya
Jangan berlambat, Kita besertanya

Seri dari Bapa akan kita puja
Seri, tersembunyi di tubuhNya
Putera Allah
Dalam lampin papa`,
    songNumber: 'I'
  },
  {
    id: 'I12',
    title: 'DENGARLAH DI PADANG SUNYI',
    lyrics: `Dengarlah di padang sunyi
Pujian riuh rendah,
Gunung bukit balas bunyi
Hutan, rimba bergema

Dend: Pujian bagi Maha Tuhan
Pujian bagi Maha Tuhan

Bercahaya sinar surga
Mundur malam yang gelap
Ribu-ribu malaikat
Nyanyi lagu yang sedap

Terperanak dalam kandang
Jurus'lamat dunia
Hai gembala, mari pandang
Serta bernyanyi pujian`,
    songNumber: 'I'
  },
  {
    id: 'I13',
    title: 'MALAM TERANG, MALAM SENANG',
    lyrics: `Malam terang, malam senang
Diampun dan lengang
Agar jangan terjaga kelak
Putera Allah yang tidur nyenyak,
Dalam sentosa benar
Dalam sentosa benar

Malam terang, malam senang
Dengarlah nyanyian
Lagu pujian Allah esa,
Khabar tebusan bagi dunia
Juruselamat ada, Juruselamat ada

Malam terang, malam senang
O Yesus di kandang
Syukur ker'na pengasihanMu
B'rikan kami anugerahMu
Hidup sertaMu kekal,
Hidup sertamu kekal.`,
    songNumber: 'I'
  },
  {
    id: 'I14',
    title: 'DI PADANG GEMBALA',
    lyrics: `Berdiam di padang gembala
semalam-malaman gelap
Mereka setia berkawal,
dihitungnya domba genap
Sekonyong berpancar cahaya
Tampaklah malaikat gemilang
Membawakan khabar senang

Hai janganlah takut, gembala,
Kubawa berita besar
Yakni lahirlah Penebusmu di Beth'lem
di kandang cemar
Beribu malaikat memuji,
Seraya bersorak merdu;
Terpujilah Allah di tinggi
Dan jadilah bumi teduh`,
    songNumber: 'I'
  },
  {
    id: 'J1',
    title: 'TINGGAL SERTA KU',
    lyrics: `Tinggal sertaku, datang keg'lapan,
Hampirlah malam, sertaiku Tuhan
Bila penolong yang lain berlalu,
Silakan Yesus, tinggal sertaku

Seg'ra kehidupan pendik lalu;
Kesukaan dunia dan hormatku;
Berubahlah, semuanya lalu;
Tuhan yang tetap, tinggal sertaku

S'lalu hadirat Tuhan ku perlu;
Setanpun dikalahkan rahmatMu
Siara sepertiMu, pemimpin ku?
Senang dan susah, tinggal serta ku.

Jika Tuhan ada, ku tak takut;
Kesusahan dan air mata tak b'rat;
Maut mana sangat kemenanganmu?
Kumenang, jiwa Tuhan serta ku.`,
    songNumber: 'J'
  },
  {
    id: 'J2',
    title: 'TUHAN ZIKOL POINTUUBUNG DIAU',
    lyrics: `Tuhan zikoi pointuubung diau
Miampai ginavo do tumongob
Nokoiho ko do mungkang zikoi
Asaasau koinsodu mantad Diau
Ompunon zikoi daa Diau
Ompunon zikoi daa Diau

Id koposizon tikid tadau
Asaasau zikoi kohiu Diau
Avagatan do koimbazatan
Kosi zikoi do au kata'an
Onuai zikoi vinakas Nu
Onuai zikoi vanakas Nu

Itti no pokinsianan dagai
Tomoimo daa poinsomok Diau
Salip Nu oh kahantazan za
Koginavaan Nu harapon za
Jesus oi koposizon za
Jesus oi koposizon za`,
    songNumber: 'J'
  },
  {
    id: 'J3',
    title: 'JESUS KU, TUHAN KU',
    lyrics: `Jesus ku, Tuhan ku
Guminavo zikoi Diau
Tuhungo zikoi doiti
Tanak nu tosisian

Tuhan ku Tuhan ku
Tumanud zikoi Diau
Ovito zikoi doino
Tanak nu tosisian

Ama ku Ama ku
Onuai zikoi do titiu
Nakansau dati zikoi
Tanak nu tosisian

Jesus ku Tuhan ku
Guminavo zikoi Diau
Oviton zikoi doino
Tanak nu tosisian`,
    songNumber: 'J'
  },
  {
    id: 'J4',
    title: 'JESUS TUHAN',
    lyrics: `Josus, Tuhan, sabap do douso ku,
Mongob-tongob banar ginavo ku

Chorus: Ompuno ou, Jesus,
Tu mokiampun zou,
Amu nodii ou humavan
Tuhan Diau

Tuhan, mada zadaai ih anak nu,
Tuhan hogo do ombiivo ku

Humoub ou do mihad id hakod nu,
Masam niman ni Magdalena nu`,
    songNumber: 'J'
  },
  {
    id: 'J5',
    title: 'ONTOK DO IHUMON NU DAA',
    lyrics: `Ontok do ihumon nu daa koinsasamadan,
Nung tumongob ginavo nu,
sabap navagatan

Ontongo Jesus, Tuhan nu,
hiho id salip zo,
Doid diau nogi, uhun, noivang ginavo zo

Koongou ko boos do osuau,
mantad do kabang zo
"Oi uhun ko, i kisusa, kano doid doho."

Tentu do osuau banar,
Jesus, pongopuhi,
Tu Ama, ka, ompuno dad,
douso nimaan diti,

Oi Ginavo ni Jesus ku,
Ziau koumohigan,
Doid ngaavi i ki douso, Ziau kaharapan.

Do Ha nu, i kitua, ponitingo no da,
Ombivo ku i ayaat, mouhagang ou da.`,
    songNumber: 'J'
  },
  {
    id: 'J6',
    title: 'SABAP DO KOSUSAAN NU',
    lyrics: `Sabap do kosusaan nu id kabun,
oi Tuhan
Ajalo zou tumanud diau do kasagan
Hinapos'ko, Ponobus, noindaman kuat,
Poiduo no ginavo ku mantad do talaat.

Jesus, tuminahan ko do siga om ugi;
Poingkaa zikoi daa kataan do
kosusaan nogi.
Sinaan salip nu, Jesus, guno do anak nu,
Sabap diau manaan daa zikoi do salip za

Pinohubuk ko, Jesus, id nuhu Calvary;
Padan poogi, oi Tuhan, Diau zikoi nogi
Oi Maria, Tina ku, tikid-tikid tadau
Intangai anganak nu i mamantang diau`,
    songNumber: 'J'
  },
  {
    id: 'J7',
    title: 'OMPUNO TUHAN, OMBIIVO',
    lyrics: `Ompuno Tuhan, ombiivo 
Vinangun nu om otuzu
Poimpusus, ki utang po
Do douso nimangan hiti
Moundoso po ombiivo
Om sumaga id ginavo
Songkuo buvai om mipadan
Gisom yantai kotuhidan

Sabap gumu kayayadan
Mouhagang kopuiman,
Diau do koundasaan
Sabap do douso do uhun
Kasangahan do mongindad
Humarap id koundasan
Om osikap do momuhas
Siksa do douso om juong`,
    songNumber: 'J'
  },
  {
    id: 'J8',
    title: 'JESUS, ZISAI GUMINAKUT',
    lyrics: `Jesus, zisai guminakut Pingka do hongon nu?
Zisai kobussu manapap,
Tuhan do yupa nu?

Doho do saha, Tuhan ku, Doho saha diti;
Ompuno, Jesus, douso ku,
Nimaan ku i ngaavi

Pingkuo do nojuhan, Tuhan,
Yupa nu d'asamba?
Zisui, e minomohapos D'innan nu kitua?
Doho do saha, Tuhan ku,....

Zisai no pinoposiga Pingka do uhu nu?
Do yugi, e ataom banar,
Natanda siga nu:
Doho do saha, Tuhan ku,.....

Zisaino pinopoinum Diau do ompodu?
Zisaino pinopohantak Diau id salip nu?
Doho do saha,....

Zisaino nokoponuhak Do undu undu nu.
Poovion da Ha nu
Mantad do Innan Nu?
Doid do saha,.....

Insiano ou, e anak nu, Maria, inde ku:
Tu zouno, e minomatai
Di Jesus, Tuhan ku,
doho do saha, inde ku, Doho saha diti.
Pokiompuno doho, inde,
Id Jesus, anak nu.`,
    songNumber: 'J'
  },
  {
    id: 'J9',
    title: 'POINSODU O MANTAD KOIMBAYATAN',
    lyrics: `Oi Tuhan intangai ikoi
Mihad-ihad id kosusaan;
Sabap no do koimbayatan
Ih popoinsodu mantad Dika.

Longon Nu oh koruhang ya
Ih kaanu manahak kasanangan;
Poinsoduo mantad koimbayatan
Om mantad karaja do rogon.

Oi Tuhan sokodungo ikoi
Soira do orikot timpu,
Id surga iwangai daa,
Om sanang nodi id dous Nu`,
    songNumber: 'J',
    author: 'Belia Toboh Tambunan'
  },
  {
    id: 'J10',
    title: 'TUROS NU DI TOLUNGGUI',
    lyrics: `Oi Tuhan okito ku lo turos Nu
Osusa olunggui tokito ku
Nawagatan ko'd katangaban
Poingkuro ku popounsikou Dia

Kaandakan diti ginawo ku
Tumanud oku Dia oi Tuhan
Minsomok om mamarati
Koinggoritan nopurimanan Nu

Oi Tuhan noinggorit ko sabap doho
Ginawo ku osodu mantad Dia
Tulungo oku oi Tuhan
Minsomok om guminawo Dia

Oi Tuhan ompuno, torimoo oku
Id sanganu oku Dia toririmo
Poinsoduo mantad koimbayatan
Ajaro oku do guminawo`,
    songNumber: 'J',
    author: 'Fr. C. Piong'
  },
  {
    id: 'J11',
    title: 'DENGARLAH DOA KU',
    lyrics: `Tuhan harapan ku
Dengarlah doa ku
Jangan Tuhan lalui
Dengarlah doa ku

Ku ditimpa malang
Jiwa ku terseksa
Tangan mu ku pinta
Dengarlah doa ku

Godaan menimpa
Membawa sengsara
Kuatkanlah Iman ku
Dengarlah doa ku

Dengarlah....oh Tuhan
Keluhan jiwa ku
Berilah petunjuk mu
Dengarlah doa ku`,
    songNumber: 'J',
    author: 'Belia Toboh Tambunan'
  },
  {
    id: 'J12',
    title: 'OI TUHAN OMPUNO OKU',
    lyrics: `Oi Tuhan, kinoingan ku
Mokiampun sabab douso ku
Nakapakaus ngaawi ii dika
Oi Tuhan ompuno oku

Oi Tuhan tumongob oku
Nokoinsodu oku dika
Sabab okodou 'ti ginawo ku
Oi Tuhan ompuno oku

Oi Tuhan jumanji oku
Au oku nodi momidouso
Posonongon ku 'ti koposion ku
Oi Tuhan ompuno oku

Tumanud oku dika Tuhan
Miampai poinwagu ginawo
Gumirot oku do id dika
Oi Tuhan ompuno oku.`,
    songNumber: 'J',
    author: 'Belia St. Theresa Tambunan'
  },
  {
    id: 'J13',
    title: 'PADA MU OH PENEBUS',
    lyrics: `Doa dan keluhanku
PadaMu ku serahkan senantiasa
Jalan ku tanpa pedoman
Beri pertolongan oh Yesus

Oh Yesus kasihanilah
Hidupkan dan kuatkanlah iman ku
Jalan iman pasti tetap
'Ku yakin Engkau menyertai

Sepanjang jalan hidup ku
SabdaMu yang membimbingkan
Dengan iman ku perjuangkan
Di pelusuk manapun kulaungkan

Korus: PadaMu oh Penebus
'Ku letakkan harapan
Datanglah kepadaku
'Kan ku buka pintu hati
Tinggallah di dalam diriku
Tinggallah di dalam diriku`,
    songNumber: 'J',
    author: 'Belia Bundu Kuala Penyu'
  },
  {
    id: 'J14',
    title: 'KAMI BERSERU PADAMU TUHAN',
    lyrics: `Kami berseru padaMu Tuhan
Dengarlah tangisan kami
Kami memohon balas kasihMu
Ampunilah kiranya.....dosa kami

Korus: Bukalah pintu hati kami
Untuk menerima karyaMu
Bagi penebusan
Umat kesayangan Mu

Atas salib Dia dipakukan
Dosa kami dihapuskan
Ker'na cintaNya pada manusia
DiriNya Dia telah ....serahkan

CintaMu tak kami salami
CintaMu tak terbatas
Engkau sentiasa memanggil kami
Bersatu denganMu....dalam cinta

Syukur padaMu ya Tuhan Allah
Atas karya penebusan
Curahkan kami dengan rahmatMu
Berilah permulaan....hidup baru`,
    songNumber: 'J',
    author: 'Belia Beaufort'
  },
  {
    id: 'J15',
    title: 'TUHAN SUMBER KEDAMAIAN',
    lyrics: `Tuhan kami datang kepadaMu
Ingin mendapat keampunan dariMu
Kami terikat dengan noda dosa
Kami merindu kedamaian di hati

Tuhan dengarlah suara hati umatMu
Yang dipenuhi dengan dosa dunia
Kami inginkan kedamaian di hati
Tuhan pandanglah dan bebaskanlah
Kami

Kor: Tuhan sinarilah
hambaMu dengan wajahMu
Kami ditimpah kesesakan dan kesusahan
Teguhkanlah langkah, hidup kami Tuhan
Dengan FirmanMu, kami dahaga kedamaian

Tuhan Engkaulah terang dan sinar kami
Engkau pembawa cahaya hidup kami
Kami berpegang pada FirmanMu Tuhan
Teguhkanlah damai dalam hati kami`,
    songNumber: 'J',
    author: 'Belia St. Peter Ranau'
  },
  {
    id: 'J16',
    title: 'OI TUHAN TULONGO YAHAI',
    lyrics: `Oi Tuhan tumongob' iti ginawo ya
Sabap no koimbayatan om douso
Ih popoinsodu mantad Dika
Papaansau mantad katapatan
Oh.....Tuhan tulungo yahai daa

Korus: Kosianai no dagai
Om sokodungo
Id komungkangaan
Onuai ikoi kawakasan
Do tumanud ralan katapatan

Oi Tuhan id Dika rikoton ya
Tu obinsianan om guminawo
Lumansan ikoi doid Dika
Tu mantad Dika konuan koposion
Oh...Tuhan tulungo yahai daa

Oi Tuhan id Dika ulion ya
Ompuno om torimoo ikoi no
Ginowoo om pawakaso ikoi
Om gompio id kokuasaan Nu
Oh...Tuhan tulungo yahai daa`,
    songNumber: 'J'
  },
  {
    id: 'J17',
    title: 'BUKALAH PINTU KEPADA PENEBUS',
    lyrics: `Yesus Penebus dan Juruselamatku
Hanyalah padaMu ku menyembah
Agung mulianya cintakasihMu
Ku serahkan seluruhnya kepadaMu

Korus: Yesus, Yesusku
Ker'na. DarahMu puaslah dahaga ku
Yesus, Yesus ku
Ker'na TubuhMu kenyanglah jiwa ku

Yesus sentiasa ku melayaniMu
Dalam hidup ku penuh syukur
Ker'na Engkaulah jalan hidup ku
Kebenaran dan kebangkitan ku

Percayalah kepada Penebus
Supaya kamu beroleh terang
Jalan hidupmu akan jadi cerah
Menuju kebahagiaan kekal

Bukalah pintu kepada Penebus
Serahkan seluruh kepadaNya
Dia akan mengasihi kita
Jika kita taatkan FirmanNya`,
    songNumber: 'J',
    author: 'Belia St. Theresa Tambunan'
  },
  {
    id: 'K1',
    title: 'JESUS NOKOTUNGAG NO',
    lyrics: `Jesus nokotungag no, aleluia
Baino poimpasi vagu. aleluia
Aiso nodii kadaan, aleluia
Baino id kaazaan, aleluia
Aleluia, aleluia, aleluia

Kanou ngaavi munsikou, aleluia
Papaazou Jesus nakamanang, aleluia
Oi Jesus zikoi tuhungo, aleluia
Ngaavi zikoi kamanang nogi, aleluia
Aleluia, aleluia, aleluia

Naampun douso du tuhun, alleluia
Kababasan natahak luhun, alcluia
Kristian ingato nodii, aleluia
Uhi tomoimo id dandi, aleluia
Alleluia, aleluia, aleluia`,
    songNumber: 'K',
    author: 'Fr. C. Piong'
  },
  {
    id: 'K2',
    title: 'HARI INILAH YESUS SUDAH BANGKIT, HALELUYAH',
    lyrics: `Nyanyi hari inilah, Haleluyah
Dari kubur naik Yesus, haleluyah
Yang kena sengsara k'ras, haleluyah
Dari maut sudah lepas, haleluyah

Sengatmu di manakah, haleluyah
Maut dan pintu neraka, haleluyah
Pada kami oleh Nya, haleluyah
Pintu surga terbuka, haleluyah

Yang berdosa hai kamu, haleluyah
Lihat tebusan itu, haleluyah
T'rimalah perdamaian, haleluyah
Olehmu dari Tuhan, haleluyah

Sungguh Yesus b'ri s'lamat, haleluyah
Carilah sampai dapat, halelayah
Olehmu dari Tuhan, haleluyah
Puji pada Mu Tuhan, haleluyah`,
    songNumber: 'K',
    songlabel: 'Christ the Lord Is Risen, today'
  },
  {
    id: 'K3',
    title: 'BAINO KRISTIAN',
    lyrics: `Baino Kristian ounsikou
Kristus mantad hobong Dau
Nokotungag tadau diti,
Bontugo tokou nodii
Aiso hasa napatai
Minomohiung dagai

Korus: Kristus Tuhan id savat,
Au nodii matai talaat

Kristus, ganti do tuhun
Minamasi di noukum
Maso matai pointahib
Tau tokou pinatahib
Kristian, ingato nodii
Uhi vagu id dandi

Kristus napatai insan
Aiso nodii kosusaan
Naampun douso do tuhun
Kristus, Tuhan, pinaazou
Tabe Raja, indama
Tabe, Tuhan om Tama`,
    songNumber: 'K'
  },
  {
    id: 'K4',
    title: 'DO SAMBAYANG OM DO YOHOU',
    lyrics: `Do sambayang om do yohou,
Om poimpakai do opuak
Mamalamai ngavi tokou
Adau diti do gloria


Cho: Ave, oi Raja do azou,
Id sorga ovito no da
Coy nogi, do yumohou;
Alleluya, Alleluya

Koginavaan na ayahom
Oi Jesus, Tuhan Raja za
Katama ko ngavi yogon
Do salip nu, e kitua

Om koyunduk ko id sahom
Do Limbu d'uhun napatai
E obuvai hinangadon
Do koikotan nu d'alamai

Ivangon nu e totombor
Do izonon d'ombivo di
Om angatan nu zossido
Id kouhagangan nodi

Ontok ko tohu no adau
Muhi nodi ombivo nu
Doid hobong, om do azou
Innan nu tumungag vagu

Ave Tuhan do gloria,
E nokatama do yogon 
Om mominasa do saha,
Om manahak kopossizon`,
    songNumber: 'K'
  },
  {
    id: 'K5',
    title: 'PONOBUS NOKOTUNGAG',
    lyrics: `Ponobus nokotungag
Kristian uhagang ko nou,
Sambao no do popazou
Id hakod do Ponobus.
Napatai aiso saha,
Sabap do douso do uhun;
Ponobus nokotungag
Om selajur apasi.

Ponobus kohubukan
Minongampun do uhun
Napatai om napasi
Naanang ngavi yogon
Uhagango Kristian
Id adau do moino,
Ponobus nokotungag
Om selajur apasi

Tu do douso timpuni
Nohodong Kinohoingan
Katanangan natagak
Sorga nogi tombohon
Tuhan Jesus d'apatai
Sorga vagu moivang
Uhun ngavi kosuang
Katanud do ponuhu.

Ngavi tokou mouhagang
Yumohou: Alleluya
Ponobus nokotungag
Alleluya d'idsavat
Id koputusan do tana
Tumungag po zi tokou
Ombivo duvo d'innan
Om id sorga do mizon`,
    songNumber: 'K'
  },
  {
    id: 'K6',
    title: 'NOKOTUNGAG NO IH JESUS',
    lyrics: `Munsikou tokou baino
Jesus nokotungag no
Poimpasi nodii baino
Id karayahan do Tama
Kotumbayaan nokogirot no

Korus: Iti no kalansanan tokou
Napasi tokou no di Jesus
Pogiroto no ih kotumbayaan tokou
Nokotungag no Ih Jesus

Kuasa do Tuhan tokou
Nokointalang no baino
Douso do pomogunan
Notobus no ngaawi Dau
Poinlansan tokou di id koposiyon Dau

Jesus nokotungag no
Tumanud di janji Dau
Tokou nga potungagon
Nung migit no di Boros Dau
Id koposiyon tokou tikid tadau`,
    songNumber: 'K',
    author: 'Belia St. Joseph Sunsuron Tambunan'
  },
  {
    id: 'K7',
    title: 'PUJIAN PASKA (EXULTET)',
    lyrics: `Paderi: Ber-so-rak-lah, pa-ra,
ma-lai-kat di sur-ga
E-lu-kan-lah, Kris-tus Ra-ja di-ra-ja,
Pu-ji-lah ke-me-na-ngan ja-ya,
Ge-ma-kan-lah bu-nyi na-fi-ri

Koir & umat: Te-puk tan-gan
Nya-nyi-kan la-gu gem-bi-ra
Ba-gi Kris-tus yang me-ne-bus ki-ta
Ber-syu-kur-lah ke-pa-da Al-lah
Ki-ta bang-kit ber-sa-ma Kris-tus


Paderi: Ber-gi-rang-lah,
umat se-lu-ruh du-nia,
Ter-ha-lau-kan,
ke-ge-la-pannya do-sa,
Ber-si-nar ca-ha-ya I-la-hi,
Ye-sus Kris-tus jun-ju-ngan ki-ta

Koir & umat: Te-puk tan-gan
Nya-nyi-kan la-gu gem-bi-ra
Ba-gi Kris-tus yang me-ne-bus ki-ta
Ber-syu-kur-lah ke-pa-da Al-lah
Ki-ta bang-kit ber-sa-ma Kris-tus

Paderi: Te-rang Kris-tus,
mem-ba-ra-kan ha-ti ki-ta
Dan si-nar-nya,
ti-ada kun-jung pa-dam
Hing-ga ki-ta ja-di ca-ha-ya
Yang ber-kor-ban ba-gi se-sa-ma


Koir & umat: Te-puk tan-gan
Nya-nyi-kan la-gu gem-bi-ra
Ba-gi Kris-tus yang me-ne-bus ki-ta
Ber-syu-kur-lah ke-pa-da Al-lah
Ki-ta bang-kit ber-sa-ma Kris-tus

Paderi: Hor-mat syu-kur,
ba-gi Kris-tus te-rang du-nia
Hor-mat syu-kur,
ba-gi Al-lah Ba-pa kita
Mu-lia ber-sa-ma Roh Ku-dus
Ki-ni dan se-la-ma - la-ma-nya

Koir & umat: A-min, A-min, A-min`,
    songNumber: 'K'
  },
  {
    id: 'K8',
    title: 'KAMANANGAN TAGAYO',
    lyrics: `Kristus nokotungag noh (2x)
Kamanangan tagayo
Mantad do kapatayon.

Kristus nokotungag noh (2x)
Notobus tokou Dau
Mantad kuasa do rogon

Kristus nokotungag noh (2x)
Apasi tokou nodii
Miampai kikalansanan

Kristus nokotungag noh (2x)
Sundung id kosusaan
Ih Jesus kalansanan

Kristus nokotungag noh (2x)
Kanou noh toinsanan
Munsikou doid Tuhan`,
    songNumber: 'K',
    author: 'Fr. C. Piong'
  },
  {
    id: 'L1',
    title: 'TADAU KA\'AMATAN',
    lyrics: `Tadau diti, ih notoodo do
Tuhan Kinoingan
Umunsikou tokou ngaavi
Sabap do nitaak Dau
Songintimung tokou tadau diti
Id doos do Tuban Kinoingan

Sumambayang zikoi ngaavi
Ontok tadau baino
Kotohuadan za doid Diau
Oi Tuhan om Tama
Mokituhung zikoi sabap tobpinai
Tasampit om tosusa

Tadau diti, Tadau Ka'amatan
Kalamazan za
Mongoi pokibalakat zikoi
Diau do paai za
Onuai zikoi no do asam om tadau
Posunizo tatanom za`,
    songNumber: 'L'
  },
  {
    id: 'L2',
    title: 'KANOU NGAAVI MUNSIKOU',
    lyrics: `Toun wagu norikot nodii
Ingkaa nogi tadau ka'amatan
Tadau do koundarangan
Kanou no pogi ngaawi munsikou

Chorus: Kotobian om kounsikaan
Tadau do ka'amatan
Id somok toi ko id sodu
Kanou no pogi ngaawi munsikou

Kanou no moboros'kotoluadan'
Kumaa id Kinoingan
Sumambayang tokou d'oinsasanan
Kanou no pogi ngaawi munsikou

Apantang ko no daa oi Tuhan
Doid pototongkop do vinoun
Sabap baino notimung zikoi
Paparayou do kuasa Nu

Kanou no moboros 'kotoluadan'
Kumaa id Kinoingan
Sabap mantad do kuasa Dau
Nakanu tokou kavasian`,
    songNumber: 'L',
    author: 'John Guasan'
  },
  {
    id: 'L3',
    title: 'TADAU KAAMATAN',
    lyrics: `Tadau nopo gia diti
Tadau do kounsikaan
Munsikou tokou ngaavi
Diti Tadau Kaamatan

Ingga oh suai tujuan
Paparayou noh do Tuhan
Bambarayon do Parai
Minamangun saviavi

Munsikou tokou ngaavi
Sabap nitahak Tuhan
Kanou tobpinai ngaavi
Monongkotoluod tokou

Kanou noh sumambayang
Mokianu kosukupan
Wanadan tokou noh daa
Id po-mo-ro-bu-atan

Kanou ngaavi tobpinai
Munsikou do-id Tuhan
Kinoingan ih Tama lokou
Bambarayon do Parai`,
    songNumber: 'L',
    author: 'Fr. C. Piong'
  },
  {
    id: 'L4',
    title: 'KANOU RAMAYO TOKOU',
    lyrics: `Norikot no wagu tadau 
Tadau tagayo do Ka'amatan
Tadau do kababasan
Kanou ramayo tokou (2x)

Chorus: Tadau ka'amatan diti
Tadau do koundarangan
Nitahak do Kinoingan
Kanou ramayo tokou
Kanou ramayo takou

Sontoun do minudipon
Minomongo do karaja
Id danau toi ko id kabun
Kanou ramayo tokou (2x)

Tikid tulun do munsikou
Om nogi mogi-aa-am-pun
Lih-wai kosusaan
Kanou ramayo tokou (2x)

Kotoluadan doid Kinoingan
Sabap ngaawi do nitahak Dau
Ih takanon om tinumon
Kanou ramayo tokou (2)`,
    songNumber: 'L',
    author: 'John Guasah'
  },
  {
    id: 'M1',
    title: 'KOGINAVAAN TUHAN',
    lyrics: `Koginavaan mantad Tuhan
Minamasi doho
Natagak zou mantad ralan
Nokoguli baino

Koginavan mantad Tuhan
Minagangat doho
Papatahak do kaharapan
Ingga korosian

Sundung alaid, sundung osusa
Kotumbayan doho
Kumaa id Tuhan Ih kikuasa
Kanou no royoho`,
    songNumber: 'M'
  },
  {
    id: 'M2',
    title: 'SURGA OM VINOUN MANGAZOU',
    lyrics: `Chorus: Surga om vi-noun se-la-jul
Ma-nga-zou Di-au

A-pa-tut zi-koi no do ma-nga-zou Diau
Tu Ki-noi-ngan ko do vo-vozon

Ka-nou no mo-nong-ko-to-hu-od 
do Tuhan
Tu pi-napata-ak Dau li Jesus

Ka-pan-ta-ngan do Ta-ma om di Ta-nak
Om di Pi-gi-na-van di-o-ho`,
    songNumber: 'M'
  },
  {
    id: 'M3',
    title: 'MIKOT ZIKOI DOID DIAU',
    lyrics: `Man-tad ko-su-sa-an ginavo
Mikot zikoi doid Diau Jesus
Doid kounsikaan om kanavaon Nu
Mikot zikoi doid Diau

Mantad sakit, doid kohidasan
Kosompitan doid kosukupan
Mantad dogo kumaa doid Diau
Mikot zikoi doid Diau

Mantad ka-ta-nga-ban ginavo
Mikot zikoi doid Diau Jesus
Doid ki-na-ma-na-ngan Salip Nu
Mikot zikoi diod Diau

Mantad do ka-ka-saan doid tana
Kumaa doid ka-sa-na-ngan doid Diau
Miampai ginavo do otoonong
Mikot zikoi doid Diau

Man-tad ko-po-kia-zaan ginavo
Mikot zikoi doid Diau Jesus
Doid kohu-du-kan gi-na-vo Nu
Mikot zikoi diod Diau

Man-tad ko-son-dii-an ginavo
Kumaa doid ko-gi-na-vaan Nu
Mimang kaan-dak Nu mantad baino
Mikot zikoi doid Diau`,
    songNumber: 'M'
  },
  {
    id: 'M4',
    title: 'KAAZAAN DOID KINOINGAN',
    lyrics: `Kaazaan doid Kinoingan Ih agazo kuasa
Id upa Dau vinangun oh tuhun
Pinoikot Ih Jesus Ih Mononobus
Do minogivang koposizon s'lajul

Chorus: Kaazaan, kaazaan
Toinsanan paapazou
Kaazaan, Kaazaan
Munsikou ngaavi no
Kanou moi doid Tama
Mantad koobian
Di Jesus Ih Tanak Dau
Do iso no

Id koginavaan Tuhan Kinoingan
Toinsanan di ongotumbazaan
Kotoimo diti koposizon s'lajul
Mantad do di gulu do nakadandi

Kinoingan Ih minama ngun saviavi
Adahan om abantug kuasa Dau
Ih minamasi do saviavi tuhun
Miampai do Zaa di Jesus
Ih Tanak Dau`,
    songNumber: 'M'
  },
  {
    id: 'M5',
    title: 'KINOINGAN TAAZOU',
    lyrics: `Kinoingan Ih tabantug
Iziau Ih pantangon om ozoon dagai
Kinoingan, Ih taa-zou
Diau ngaavi izikoi

Refrain: Tuhan do koposizon
Gi-na-vo, koginavaan
Tu-han, Ih ginovoon
Patut do o-zo-on

Kinoingan, Ih vo-voo-zon
Kotohuadan ngaavi di grasia Nu
Ih notoimo ngaavi da-gai
Mantad koginavan Nu

Kanou no mogi-a-ampot
Mamung do Malaikat
Om Sangti ngaavi
Pa-a-pa-zou om papaban-tug
Do kaazaan Kinoingan`,
    songNumber: 'M'
  },
  {
    id: 'M6',
    title: 'PIBABASAN',
    lyrics: `Pibabasan taako
Doid songovian tuhun
Taako kababasan
Ih pointantu, pointatap

Miampai do Kinoingan, Ih Tama tokou
Kanou ngaavi miiso, doid kovosian

Poguhuono zou
Doid kobuuan diti
Doid k'laja ku ngaavi
Om nogi koimaan ku

Mamadandi zou baino,
mizon id kovosian s'lajul
Pibabasan taako
Ih pointantu, pointatap`,
    songNumber: 'M'
  },
  {
    id: 'M7',
    title: 'OINSASANAN HUMOZOU',
    lyrics: `Ant: Oinsasanan humozou kaandasan
Doid Tuhan Minaamangun

Unsikou no saviavi
Papazou kaazaan Tuhan
Miampai hozou mogi-ampot-ampot
tokou:
Kobontugan Diau id savat

Unsikou no ngaavi tokou
Kinoingan Ih minomohou
Simbao no miampai kotumbazaan
Koginavan om kahansanan

Sambao no, pantango no
Oh ngaan Tuhan Kinoingan
K'laja Dau adahan id tanga tokou
Savi-avi mo-nong-ko-to-huod

Kobontugan, kapantangan
Kotohuadan Diau Oi Ama
Om di Tanak om di Spiritu Sangti
Kobontugan Diau id savat`,
    songNumber: 'M'
  },
  {
    id: 'M8',
    title: 'TUHUNGO TUMATAP ID DIAU',
    lyrics: `Ih Mary iso tondu hahangai
Id Nazareth nizonon dau
Poingontizan iso Tanak
Ih Jesus Ih Mononobus

Refrain: Kristus Tuhan
Tuhungo, tuhungo
Zikoi ngaavi, tumatap id Diau

Id Kampong Juda Kinosusuvon
Id kadai Bethlehem iho
Gugumompi tazam, malaikat
Tohu raja noko-tombuhui

Id Galilea pinangajalan
Minamasi di napatai
Minama-vasi di sontob
Tuhun nakaanu do toluo

Ih Kristus, songian noikot oh timpu
Pahanato no hongon Dau
Doiho id salip minatai
Sabap tokou songovian

Doid tokou songovian nakataak
Koposizon do Kinoingan
Sabap no do kinotungagan
Mantad hobong kapatazon`,
    songNumber: 'M'
  },
  {
    id: 'M9',
    title: 'OI MIONTONG',
    lyrics: `Oi Miontong idoos dogo
Avanus toomod ko
Mantad ko surga di'd savat
Do mintamong dogo

Voos nu taalus om anavau
Amu okito ku
Adahaan osuau kabang
Om aiso toongou ku

Au kopiuman do hongon nu
Monontuduk lahan
Miaga do Tina haid mimang
Do aiso kahasaan`,
    songNumber: 'M'
  },
  {
    id: 'M10',
    title: 'MALAIKAT KU DO OSUAU',
    lyrics: `Malaikat ku do osuau,
Selajur tamangan nu ou
Yahan d'avasi tuduko
Id otuvong panavao.

Ontok do omuhok po ou,
Amu ou daa mooi iumahau
Sakahi koiahau ou daa,
Lekas poguhio ou daa.

Nung ayaat ginavo ku
Om pikilan amu tentu,
Ajaho no, katama ou
D'ombiivo ku do pangazou.

Koinsomok ih jaam tohui
Mantad do tana do midu
Tuhungo ou, oi Malaikat,
Om ovito doid Savat.`,
    songNumber: 'M'
  },
  {
    id: 'M11',
    title: 'SANGTI JOZEF',
    lyrics: `Sangti Jozef, tanak David
Savo Tobitua Maria
Tama do gumompi Jesus
Ponobus do tuhun ngaavi

Cho: Apantang, apantang, apantang ih Jozef (2x)

Sinuu Ko no do Malaikat
Do mongoi id kampong Bethlehem
Om doiho no tanak Jesus,
Do maria nosusu no.

Tinuduk no do Malaikat
Ogumu no tuhun miskin
Om tohu no Raja nogi
Sumamba do Tanak Jesus.

Do id Egypt tanak Jesus
No'ovit di Sangti Josef
Pina'abar do Malaikat
Patazon mai di Herodes.

Om kapapatai Herodes
Josef minuhi po vagu
Katagak no tanak Jesus
Nokito dioho id Gereja.`,
    songNumber: 'M'
  },
  {
    id: 'M12',
    title: 'AVASI ADAT KATOLIK',
    lyrics: `Avasi Adat Katolik
Naajal do Kinoingan sondii
Lahan kumaa id Disido
Poingkuo tuhun miho sondii?

Choros: Kristian mgaavi, kotumbazaai
Kaajalan ada zadami
Kaajalan ada zadaai

Isai amu otumbazaan
Oukum nogi do Kinoingan
Koikot po Isido p'reksaan
Boos om koimaan on nitungan

Kristian misti otumbazaan
Om tumunjuk nogi ponuu
Amu ahaid tokou sanang
Nung miaga nogi koimaan`,
    songNumber: 'M'
  },
  {
    id: 'M13',
    title: 'KRISTIAN NGAAVI',
    lyrics: `Kristian ngaavi, kanou kou
Mooi tuubung do Raja zu
Jesus, ih Tuhan tokou
Momorinta diozu                          
Dandian zu daa do baino          )
Do tumanud Diau tomoimo       ) 2x

Tuhan Ko om Raja za
Jesus Tanak Kinoingan
Moguhu Ko balis za
Masa do pisangadan
Dandian za nodii baino            )
Tumunjuk Diau tomoimo          ) 2x


Om oikot no jaam tokou
Do monoimo tingadan
Jesus om ih Sangti Dau
Mooi panaak tokou kaazaan
Ih tumanud diau do baino        )
Munsikou doiho tomoimo        ) 2x`,
    songNumber: 'M'
  },
  {
    id: 'M14',
    title: 'OI SURGA TINGADAN',
    lyrics: `Oi Surga tingadan, tomoimo ondomon
Kada hobi suka, barang pomogunan
Tantu, tantu, oi surga tingadan
Tantu, tantu, oi surga tingadan

Om nung Ziau susa, pasavato mato
Om tahan, halapo, surga tantu kaanu
Tantu, tantu, oi surga tingadan
Tantu, tantu, oi surga tingadan

Kada tanud logon, do id ponginaman
Sabap, nung tumanud, tagak ih tingadan
Tantu, tantu, oi surga tingadan
Tantu, tantu, oi surga tingadan`,
    songNumber: 'M'
  },
  {
    id: 'M15',
    title: 'KINOINGAN, IH PUUN DO KOGINAVAN',
    lyrics: `Vovozoon Kinoingan, Ih tavakas
Humuzuk zikoi sumamba Diau
K'laja Nu agazo zikoi mamabantug
Ziau Ih Kinoingan do taazou

Kinoingan Tama, tobinsianan,
Kosianai ngaavi di tanak Nu
Onuai zioho do grassia Nu
Humavan ngaavi do koimbazatan

Kinoingan, Ih puun do koginavan,
Pavakaso no koginavan za
B'lakatai ngaavi Ih sontob layat Nu
Pomogunan om polinta ngaavi`,
    songNumber: 'M'
  },
  {
    id: 'M16',
    title: 'BONTUGON TOKOU NGARAN DAU',
    lyrics: `Kanou toinsanan mamarayou
do Tuhan Kinoingan
Kanou royoho, kanou royoho
Royohon tokou Tuhan,
miampai aawi ginawo
Ouhi I-yau doid karaja ngaawi Dau
Kapadan lyau do royohon tokou
Bontugon tokou Ngaran Dau

Kanou toinsanan mogihum
do Tuhan Kinoingan
Kanou sumambayang, kanou ihumo
Mokinsian tokou do ko-om-punan Dau
Mangampun lyau di douso tokou
Monulung lyau lumawan do douso
Bontugon tokou Ngaran Dau

Kanou toinsanan sumurupu
do Tuhan Kinoingan
Kanou sumurupu, kanou mogobi-obi
Id pogii-giyon popointalang
do kawasian Dau
Kristus Tuhan Ih ninawau
do pomogunan
Kanou sumurupu miampai winakas
Bontugon tokou Ngaran Dau`,
    songNumber: 'M',
    author: 'Fr. W. Poilis/Justin Lus'
  },
  {
    id: 'M17',
    title: 'KRISTUSLAH SUMBER KEHIDUPAN',
    lyrics: `Kristuslah penyelamat hidup ku
Serahkan beban hidup padaNya
Susah dan senang 'kan dipimpinNya
Kristuslah sumber kehidupan

Hidup yang sesat dis'lamatkanNya
Didalam kegelapan dosa
Hidup dalam penuh percobaan
Tuhan s'lalu berjalan bersama Ku

Kesusahan tiada dapat menolong
Hanya Yesus kekäsih sejati
KasihNya s'lalu melimpah hidup ku
Kristuslah sumber kehidupan`,
    songNumber: 'M',
    author: 'Belia Toboh Tambunan'
  },
  {
    id: 'M18',
    title: 'YESUS MEMBERI HARAPAN',
    lyrics: `Suatu kenyataan di dalam hidupku
Yesus selalu memberi pertolongan
Ku telah terlepas dari beban dosa
Hanya Yesus perlu kemurahan

Apa lagi yang kita cari
Didalam dunia kehancuran
Jika tiada kesedaran manusia
Dosa tiada dapat dihapuskan

Oh...oh Yesus, Memberi harapan selalu
Oh...oh Yesus,
Selalu menunggu yang berdoa.
Oh...oh Yesus, Kuasa yang mulia.`,
    songNumber: 'M'
  },
  {
    id: 'M19',
    title: 'OH HATI YESUS TERLUKA',
    lyrics: `Oh Hati Yesus terluka
Hati Yesus berdarah
Mengalirlah darah merah

Oh Hati Yesus menjerit
Hati Yesus memohon
Supaya kami bertobat

Oh Hati Yesus menangis
Hati Yesus sangat duka
Meminta la dikasihi

Oh Hati Yesus Mulia
Hati Yesus sungguh suci
Bagaikan embun yang putih`,
    songNumber: 'M'
  },
  {
    id: 'M20',
    title: 'SAYA MAU IRING YESUS',
    lyrics: `Korus: Saya mau iring Yesus
Saya mau iring Yesus
Sampai selama-lamanya

Walaupun saya susah
Menderita dalam dunia
Saya mau iring Yesus
Sampai selama-lamanya

Walaupun saya buta
Tak pernah lihat dunia
Saya mau iring Yesus
Sampai selama-lamanya`,
    songNumber: 'M'
  },
  {
    id: 'M21',
    title: 'DENGARLAH DOAKU',
    lyrics: `Yesus Tuhan Penebus ku
Dengar doa ku
Janganlah Tuhan lalui
Bri'lah berkatMu

Korus: Yesus, Yesus, dengar doa ku
Janganlah Tuhan lalui
Bri'lah berkatMu

Engkau Tuhan Pengasihan
Sla'matkan daku
Kuatkan hamba dalam iman
Aku milikMu

Ku berharap kepadaMu
Bri' anugeraMu
Sembuhkan hati yang hancur
Sucikan daku

Yesus pohon Kesukaan
Kesenangan Ku
Dari harta sekalian
Engkau Raja ku`,
    songNumber: 'M'
  },
  {
    id: 'M22(a)',
    title: 'BERITAKAN',
    lyrics: `Mari kawan-kawan kita pergi bersama
Ke s'luruh dunia menyampaikan berita
Bahwa Allah mengasihi
Seluruh dunia dan menyediakan kita
Kehidupan kekal

Sambutlah temanku damai
yang t'lah ku t'rima
Harap pada Tuhan,
di mana pun kau ada
Kuserukan dalam dunia,
ku mau orang tahu
Tuhan datang di hatiku,
ingin ku sampaikan`,
    songNumber: 'M'
  },
  {
    id: 'M22(b)',
    title: 'YESUS TUHANKU',
    lyrics: `Yesus Tuhan ku, Yesus Tuhan ku,
Yesus Tuhan ku, tomoimo
Yesus Tuhan ku, Yesus Tuhan ku
Yesus Tuhan ku, tomoimo

Papaazou zou Diau......

Yesus Raja ku………..`,
    songNumber: 'M'
  },
  {
    id: 'M23',
    title: 'TURUNLAH KHALIK ROH KUDUS',
    lyrics: `Turunlah Khalik Roh Kudus
Batin rakyatMu kunjungi
Penuhi jiwa makhlukMu
Dengan nikmat yang surgawi

Penghibur gelarMu benar
Kurnia Bapa terbesar
Pancurlah api dan kasih
Dan pengurapan ilahi

Terangkan pancaind'raku
Curahi hati kasihMu
Tubuh yang enggan dan lemah
Sudilah langsung kuatkan

Kenalkan Bapa yang esa
Dan kebesaran AnakNya
DiriMu pun kenalkanlah,
Yang Rohul 'kudus Allah sah`,
    songNumber: 'M'
  },
  {
    id: 'M24',
    title: 'MAHA TUHAN YANG ESA',
    lyrics: `Maha Tuhan yang esa
MilikMulah semuanya
Allah kuat dan benar
Khalik lagi Pelenggara
Tiada permulaanNya
Pun tak ada akhirNya

Langit, bumi, darat, laut
Matahari, bulan, bintang
Sama puji namaMu
Berseruhkan kodrat Allah
Rakyat pun permulia
RuhimMu tak hingganya

Dalam surga Serafim
Ucap kudus, kudus, kudus
Dan segala Kerubim
Turut nyanyi tak terputus
Orang kudus sambungkan
Selamanya pujian`,
    songNumber: 'M'
  },
  {
    id: 'M25',
    title: 'KEPADA HATI YESUS',
    lyrics: `Kepada Hati Yesus
Menyanyi jiwaku
Ke langit yang tertinggi
Jiwaku berseru:

Dend: Segala manusia
Kasibi Allahku
Kepada Hati Yesus
Berilah hatimu
Kepada Hati Yesus
Berilah hatimu!

Tiada satu hati
Yang berkemurahan
Sebagai Hati Yesus
Pohon pengasihan

Ya Hati yang terbuka
Hendaklah jiwaku
Terlindung dari jahat
Di dalam lakuMu`,
    songNumber: 'M'
  },
  {
    id: 'M26',
    title: 'OI PARADAIS',
    lyrics: `Oi Paradais, oi Paradais
Isai amu nouzan
Isai amu gumaab mongoi
Masuk koundangan

Cho: Avasi daa doiho
Avanus, asanang
Poimpasi tomoimo
Idoos do Kinoingan

Oi Paradais, oi Paradais
Songian koikot tadau
Nookuo tu oosizan matai
Mongoi intong Diau

Oi Paradais, oi Paradais
Maahan doiti izou
Hangadon zou do Jesus ku
Doiho zou ounsikou`,
    songNumber: 'M'
  },
  {
    id: 'M27',
    title: 'KOMUHAKAN HAHANSANON DO KOHOMINAN OM POGUN',
    lyrics: `Miad-miad ginavo tokou
Songian tokou koongou
Ogumu kozo komuhakan
Ih nakalavong no do baino

Komuhakan id nombo nopo
Kanou no gia momusoou
Zotokou no hahansanon
Doid kohominan om pogun tokou

Kor: Guhi kou no oi komuhakan
Do tumanud id lahan totopot
Pinataak di ama ina
Ih giminavo do tokou tomoimo

Komuhakan kanou no ngaavi
Momusoou gia do baino
Guhi no doid Kinoingan
Om zadaai ih kotuvangan`,
    songNumber: 'M',
    author: 'Fr. Peter Abas'
  },
  {
    id: 'M28',
    title: 'OI TUHAN TOBINSIANAN',
    lyrics: `Oi Tuhan ih tobinsianan
Kinongoho noh iti sambayang ku
Polomhuson miampai kalansanan
Toinsanan ti suang ginawo ku
Tulungo ku monoguang koposion ku

Kor: "Yoku ralan, katapatan, koposion"
Boros nu di koinsasamod doho
Manahak komoyon ti koposion ku

Sodop tadau opurimanan ku
Kosusaan rumikot id doho
Aiso suai ralan monoguang
Nga la noh ih ralan koposion
Tulungo ku miampai winakas nu

Nokuro tu katangaban nopo
Purimonon tikid tadau sodop?
Kada oku pologoso oi Tuhan
Oimbayat tumanud kahandak ku
Tu la noh katapatan koposion`,
    songNumber: 'M',
    author: 'Fr. C. Piong'
  },
  {
    id: 'M29',
    title: 'TUHAN NO RALAN KATAPATAN OM KOPOSION',
    lyrics: `Oi Tuhan dii tobinsianan
Igitai iti longon ku
Kotuwongon mogimbayat doho
Ralan ku noponu korugian

Mamanau au ku kapanau
Kada oku pologoso Tuhan
Kagasan do kuasa pomogunan
Otumbayaan oku Dia Tuhan

Kor: lya no ralan, katapatan
Koposion selajur om sogiigisom
Kada oku tolikudai
li guminawo Dia tikid tadau

Oi Tuhan intangai oku
Poimpasi hiti pomogunan
Au koilo hombo pakayaan
Sokodungo oku Dia Tuhan`,
    songNumber: 'M',
    author: 'Fr. Peter Abas'
  },
  {
    id: 'M30',
    title: 'TAMA DO KOSIANAN',
    lyrics: `Oi Tuhan Kinoingan
Tama do kosianan
Tama do koginavaan

Soira id pogumbalan
Soira kosusaan
Doid dika kalansanan

Kor: Oi Tuhan hiti oku
Sumingkotud om sumambayang
Monongkotoluod dika
tu nosianan ko doho

Nombo oku do baino
Nung okon noh kho la
Tama do koginavaan

Hiti id pomogunan
Maso monompogunan
Ogumu katangkangau

Otumbayaan oku
Poinsomok kho id doho
Manud-tanud kho doho`,
    songNumber: 'M',
    author: 'Fr. C. Piong'
  },
  {
    id: 'M31',
    title: 'ALLAH ITU ADALAH KASIH',
    lyrics: `Allah itu adalah kasih
Namun kasihNya dikhianati oleh dosa
Tetapi kasihNya setia dan abadi
Manusia hidup kembali dalam Nya

Kasih Allah ternyata dalam kita
DiutusNya Kristus ke dunia
Menyelamatkan kita dari dosa
Sumber perdamaian dan kehidupan

Kor: Percayalah hai domba-domba
Allah gembala yang maha baik
Kita diiring ke padang kehijauan
Ke arah kehidupan kekal

Kasih Allah kita kenali
Didalam cinta kasih sesama
Rohnya sentiasa bersama kita
Membina hidup yang harmoni

Saudara seiman dalam Kristus
Tanpa kasih hidup tak bererti
Usahakanlah hidup penuh kasih
Agar kerajaan Allah teguh selamaNya`,
    songNumber: 'M'
  },
  {
    id: 'M32',
    title: 'KITA SATU DALAM TUHAN',
    lyrics: `Kita satu dalam Tuhan
Kita satu dalam Tuhan
Kita disatukan didalam Roh Tuhan
Kita satu dalam Tuhan

Kor: Mari kita bernyanyi
Rasakan kasih Tuhan
Mari berpegang tangan
Supaya dunia tau
Kita satu dalam Tuhan

Kita satu dalam iman
Kita satu dalam iman
Kita disatukan didalam iman
Kita satu dalam iman`,
    songNumber: 'M'
  },
  {
    id: 'M33',
    title: 'BERSAMA MALAIKAT DI SYURGA',
    lyrics: `Bersama malaikat di syurga
Nyanyikan kidung pujian
Bermazmur bagiMu muliakan namaMu
Yesus aku memujiMu

Tanganku kuangkat padaMu
Masuk dalam hadiratMu
Rasakan kasihMu
Kujadi milikMu
Yesus aku menyembahMu

Hossana, Hossana
Aku memujiMu,
Halleluia, Halleluia 
Aku menyembahMu`,
    songNumber: 'M'
  },
  {
    id: 'N1',
    title: 'MIGINAVO DOID TUHAN',
    lyrics: `Tadau baino tadau kounsikaan
Notuhuk noh ngaavi dandi toh
Suming-kotud toh om sumambah'to
Doid Tuhan, ih ginvoon'to

Oi Maria ginovoon ku iziau
Dumandi zou kuma doid Tuhan
Gompizon ku iziau do soumul-umul
Osusa ko toi sumakit ko

Oi Tuhan za
Blakatai zikoi
Mohoing om tobpinai ngaavi
Humansan diau zikoi ngoduvo
Au daa kansau Tanak nu doiti`,
    songNumber: 'N'
  },
  {
    id: 'N2',
    title: 'TADAU PISASAVAAN',
    lyrics: `Kotohuadan doid diau
Oi Ama doid surga
Nonuan zikoi do timpu
Tanda piandad-andad za

Tadau no dii baino
Pisasavaan za
Sumingkotud izikoi
Balakatai zikoi no

Dumandi zikoi diau
Tumanud ka'jalan nu
Do au zikoi miada
Gisom soumul-umul

Kotohuadan doid diau
Oi Ama doid surga
Ounsikou ginavo za
Do tumanud diau`,
    songNumber: 'N',
    author: 'Paul Kadau'
  },
  {
    id: 'N3',
    title: 'LUNCING PISASAVAAN',
    lyrics: `Monguni noh iho luncing
Luncing Pisasavaan zu
Ogumu Tuhun sumaksi
Mohoing om Tompinai ngaavi

Oi Ama ku doiho surga
Doiti zioho noh ngoduvo
Dumandi ma zioho id diau
Miginavo do soumul-umul

Tumanud zou nogi do munsikou
Tu notuhuk nodi dandi diozu
Atatamis kou noh da ngoduvo
Pisasavaan zu do soumul-umul`,
    songNumber: 'N',
    author: 'Paul Kadau'
  },
  {
    id: 'N4',
    title: 'PIGOGOMPI KOU NO',
    lyrics: `Norikot nodii moti
Iti timpu dikoyu
Do miolon do dandi
Dandi do totopot
Doid toguwang do Kinorohingan

Chorus: Doid kusai toi doid tondu
Piigit kou no dino longon
Ino no tanda do piginawaan
Pigoo-gompi kou no do tiso om tiso

Timpu nopo diti
Nga timpu poo-sing-ko-tud kou
Doid Panambayangan
Mokiisian barakat
Doid toguwang do Altar di Jesus

Baino nopo diti
Nga timpu tuuminpuun kou
Do miginawo
Piginawaan totopot
Gisom do soumul-umul
Gisom do soumul-umul`,
    songNumber: 'N',
    author: 'Maurice Awit'
  },
  {
    id: 'O1',
    title: 'NOKOTUNGAG MANTAD HOBONG',
    lyrics: `Nokotungag mantad hobong
Om Tumakad no e Tuhan
E nokatama do yogon
Nazau nodii miad padan

Zisai e Raja om Tuhan
E tumakad doid sorga
Id gloria om kazahan?
Jesus no, ngan zo kitua

Havun do avan kleta zo
E kumi lou miad d'amas;
Om iumohou malaikat zo
Duvo d'ombivo pinhapas

Zisai e Raja om Tuhan
E tumakad doid sorga
Id gloria om kazahan?
Jesus no, ngan zo kitua

Pingka no sumuang Kristus
Id karajaan do gloria
Do hiho id diau, Jesus
Zioi nogi foimon nu da

Zisai e Raja om Tuhan
E tumakad doid surga
Id gloria om kazahan?
Jesus no, ngan zo kitua`,
    songNumber: 'O'
  },
  {
    id: 'P1',
    title: 'KINOHOINGAN POVOZON',
    lyrics: `Kinohoingan Povozon
Minamangun Ko do ngaavi
Sorga, tana om uhun
Om nogi malaikat ngaavi
E navangun Nu Tuhan
Sumujut miad padan

Ngan Nu om kavasa Nu
Pantangon za da toimoimo
Do yohou om sambayang
Id tohui miad do moino
Sanctus, sanctus, sanctus, ka
Do yohou selajor da

Sanctus Ama Povozon
Sanctus Anak om Tuhan za
Sauctus nogi Spiritu
Kointohuvan kitua
Kazahan om gloria
Doid Kinohoingan za`,
    songNumber: 'P'
  },
  {
    id: 'P2',
    title: 'NGAVI NGAVI UHUN KRISTIAN',
    lyrics: `Ngavi ngaavi uhun Kristian
Padan miho om pisaya
Nung uhun amu pisaya
Kinohoingan momogo

Kiiso no Kinohoingan
Tohu Persona id sahom
Kinohoingan Ama, Anak
Hagi Sante Spiritu

Ama d'ino Kinohoingan
Miamung do Anak zo
Spiritu sante, Kinohoingan
Doid sorga izonon

Sakahi tohu no Persona
Iso no Kinohoingan
Miiad tatap om tuo
Amiso tinimpunon

Napataio nohobongo
Tumungag adau Pascha
Minopung id pomogunan
Sampai adau Ascensio

Do kavassa nissido no
Doid sorga katakad,
Pentecosten Spir'tu sante
Id Apostei tumuhun

Id koputusan do tanna
Ponobus koikot vagu
Momohukum uhun ngaavi
E suhuor opossizan

Doid sorga poposuang maai
Do uhun do avassi
Om doid apui naraka
Do uhun e ayaat`,
    songNumber: 'P'
  },
  {
    id: 'P3',
    title: 'VOOVOZOON KINOINGAN ZA',
    lyrics: `Voovozoon Kinoingan za
Minamangun saviavi
Diau Surga om tana
Malaikat om Sangti ngaavi
Adahaan do kuasa Nu
Abantug nogi Ngaan Nu

Sangtus Tama om Jesus
Tuan za om Mononobus
Sangtus nogi Spiritus
Mantad duvo nakahabus
Osundu tohu iso
Om kabantugan oizo`,
    songNumber: 'P'
  },
  {
    id: 'P4',
    title: 'OI KINOINGAN, OI VOVOZOON',
    lyrics: `Oi Kinoinga, Oi Vovozoon
Onuai zikoi do balakat Nu
Pohiongo zikoi mantad douso za
Tambai zikoi humavan kalaatan

Korus: Otumbazaan zou kivaa Kinoingan
Tama Vovozoon, Ib Tanak
Om Spiritu Sangti, Amen

Oi Kinoingan, Oi Vovozoon
Mantad do baino om soumul-umul
Ondomon, opion za timpu diti
Timpu koponongkotohuadan Diau`,
    songNumber: 'P'
  },

  ...songsR
]

export default songs;




