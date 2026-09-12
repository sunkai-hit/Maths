/* 第一章《三角形》材料整理：专题方法。 */
TID("c1-12","1.0","旋转、手拉手与一线三等角模型","手拉手模型是旋转模型的典型形式：两个共顶点的等腰三角形顶角相等，可通过角的和差得到一组夹角相等，再用 SAS 证明全等。一线三等角则通过三个等角推出新的等角并用 AAS/ASA。","遇到共顶点、等边长、相等大角时优先尝试旋转；遇到三个等角顶点共线时，先找由等角关系推出的第四个等角。","模型结论不能直接套用，需核对等边、等角和点的位置是否满足模型条件。",
 Q("解答题","AC⊥BC，DC⊥EC，AC=BC，DC=EC，AE 与 BD 相交于 F。（1）证明 AE=BD；（2）求 ∠AFD。","（1）AE=BD；（2）90°",["由两个直角可得 ∠ACE=∠BCD。","在 △ACE 与 △BCD 中，AC=BC、CE=CD、夹角相等，所以两三角形 SAS 全等，得 AE=BD。","由全等得到相应角相等，再结合直角三角形余角关系，可得 AE⊥BD。","因此 ∠AFD=90°。"],[]),
 Q("解答题","AE=AB，AC=AF，∠BAE=∠CAF=90°，EC、BF 交于 M。（1）证明 EC=BF；（2）证明 EC⊥BF；（3）若两个 90° 同时改为 m°，上述两个结论是否仍成立？","（1）EC=BF；（2）EC⊥BF；（3）第一结论成立，第二结论不一定成立",["由角的和差得 ∠EAC=∠BAF，结合 AE=AB、AC=AF，得 △EAC≌△BAF（SAS），所以 EC=BF。","利用全等得到的对应角和对顶角，可得两直线夹角为 90°，所以 EC⊥BF。","若公共旋转角改为 m°，SAS 仍成立，因此 EC=BF 仍成立；两直线夹角变为 m°，不再必为 90°。"],[]),
 Q("证明题","△ABC 中，∠BAC=90°，AB=AC。直线 m 过 A，BD⊥m、CE⊥m，垂足为 D、E。证明 DE=BD+CE；若改为 ∠BDA=∠AEC=∠BAC，结论如何？","两种情形均有 DE=BD+CE",["第一种情形中，由两个垂直和 ∠BAC=90° 可得 ∠ABD=∠CAE。","结合两个直角、AB=AC，得 △ADB≌△CEA（AAS），所以 BD=AE、AD=CE。","DE=DA+AE=CE+BD。","第二种情形用三个等角同样推出 ∠DBA=∠CAE，再由 AAS 得相同结论。"],[]),
 Q("填空题","等腰直角三角形 ACD 中，AC=DC，E 在 AC 上，BE=ED 且 ∠BED=90°。按“一线三垂直/三等角”方法可得 ∠CDE+∠EBA=____。","45°",["过 B 作 AC 的垂线交 CA 延长线于 F。","由余角关系得 ∠AEB=∠CDE；结合 EB=ED 和两个直角，可证 △FEB≌△CDE（ASA）。","进一步得到 AF=BF，所以 Rt△ABF 为等腰直角三角形，∠BAF=45°。","∠CDE+∠EBA=∠BAF=45°。"],[]));

TID("c1-13","1.0","构造公共边与倍长中线","当两个待比较三角形缺少公共条件时，可添加公共边；有中点、中线时可延长中线取等长点，构造“8 字型”全等，把分散的边角条件转移到一个三角形中。","构造公共边时优先连接两个已知等距关系的公共顶点；倍长中线时延长中线使新段等于原中线，再用 SAS。","辅助线必须服务于现有条件，不能凭空假设新线段相等或新角相等。",
 Q("证明题","AC、BD 相交于 O，AC=BD，AD=BC。证明 ∠A=∠B。","∠A=∠B",["连接 CD。","在 △ADC 和 △BCD 中，AC=BD、AD=BC、DC 为公共边。","所以 △ADC≌△BCD（SSS），对应角 ∠A=∠B。"],[]),
 Q("证明题","D、E 分别在 AB、AC 上，BE、CD 交于 O，AB=AC，BO=CO。证明 ∠B=∠C。","∠B=∠C",["连接 AO。","在 △AOC 和 △AOB 中，AC=AB、CO=BO、AO 为公共边。","所以 △AOC≌△AOB（SSS），得 ∠B=∠C。"],[]),
 Q("填空题","△ABC 中，D 是 BC 中点，AB=4，AD=3，设 AC=x，则 x 的取值范围为____。","2<x<10",["延长 AD 到 E，使 DE=AD=3，连接 BE。","由 BD=DC、DE=AD、∠BDE=∠ADC，可证 △BDE≌△CDA（SAS），所以 BE=AC=x。","在 △ABE 中，AB=4、AE=6，根据三边关系得 6−4<x<6+4，即 2<x<10。"],[]),
 Q("证明题","AB=AE，AB⊥AE，AD=AC，AD⊥AC，M 是 BC 中点。证明 DE=2AM。","DE=2AM",["延长 AM 到 N，使 AM=MN。由 M 为 BC 中点，可证 △AMC≌△NMB（SAS），得到 AC=NB 及相应角关系。","由 AD=AC 得 AD=BN，再结合两组垂直关系推出 ∠EAD=∠ABN。","△ABN≌△EAD（SAS），所以 DE=AN。","AN=2AM，因此 DE=2AM。"],[]));

TID("c1-14","1.0","倍长中线、截长补短与作平行线","线段和差型全等题常用三类辅助线：倍长中线把中点条件转化为全等；截长法在长线段上截取一段等于短线段；补短法延长短线段；平行线法用于制造等角或等边。","目标若是“长线段=两短线段之和”，优先尝试截长或补短；中点出现时优先倍长；角关系不足时可考虑作平行线。","截取或延长出的等长关系是作图定义得到的，后续仍需通过全等证明剩余线段关系。",
 Q("证明题","△ABC 中，D 为 BC 中点，M 在 AC 上，BM 与 AD 交于 F。若 ∠AFM=∠MAF，证明 BF=AC。","BF=AC",["延长 AD 至 E，使 DE=AD；由中点和对顶角可证 △EDB≌△ADC（SAS），得到 BE=AC 且 BE∥AC。","利用 ∠AFM=∠MAF 及平行关系，把相应角转化到 △BFE。","按材料再作 BN⊥AE，可由 AAS 证明相关直角三角形全等，得到 BF=BE。","因此 BF=AC。"],[]),
 Q("证明题","AC∥BD，AE、BE 分别平分 ∠CAB、∠DBA，E 在 CD 上。用截长法证明 AB=AC+BD。","AB=AC+BD",["在 AB 上截取 AF=AC。由 AE 平分 ∠CAB，可证 △ACE≌△AFE（SAS）。","由全等得到相应角，再结合 AC∥BD 的同旁内角关系，推出另一组角相等。","可证 △BEF≌△BED（AAS），所以 BF=BD。","AB=AF+BF=AC+BD。"],[]),
 Q("证明题","AC∥BD，AE、BE 分别平分 ∠CAB、∠DBA，E 在 CD 上。用补短法证明 AB=AC+BD。","AB=AC+BD",["延长 AC 到 F，使 AF=AB。由角平分线可证 △AEF≌△AEB（SAS），得 EF=EB 及相应角相等。","结合 AC∥BD，把角关系转移到 △CEF 与 △DEB。","由 AAS 证明 △CEF≌△DEB，得到 CF=DB。","AB=AF=AC+CF=AC+BD。"],[]),
 Q("证明题","在等边 △ABC 中，D 在 AB 上，E 在 BC 延长线上，AD=CE，DE 交 AC 于 F。证明 DF=EF。","DF=EF",["过 D 作 DG∥BC，交 AC 于 G。","由等边三角形各角为 60°，可得 △ADG 为等边三角形，所以 DG=AD=CE。","结合平行线和交叉线产生的等角，可证 △DFG≌△EFC。","因此 DF=EF。"],[]));

TID("c1-15","1.0","平行线变式与半角模型","作平行线可把角平分线条件转化为等腰三角形或全等条件；半角模型常出现在正方形、等边或一组邻补角中，通过绕公共点旋转构造全等，把线段和转化为一条对应边。","若目标是角平分或等边，可在中点附近作平行线；若出现“大角的一半”以及两条相等边，可考虑绕公共顶点旋转。","半角模型的旋转角必须与大角匹配；旋转后要检查共线关系，再用 SAS 证明第二组全等。",
 Q("证明题","△ABC 中，D、E 在 BC 上且 DE=EC。过 D 作 DF∥AB 交 AE 于 F，且 DF=AC。证明 AE 平分 ∠BAC。","AE 平分 ∠BAC",["过 C 作 CM∥DF，交 AE 延长线于 M。由平行线和对顶角，可证 △DFE≌△CME。","所以 DF=CM；又 DF=AC，得 CM=AC，从而 ∠M=∠CAE。","DF∥AB，所以 ∠DFE=∠BAE；又 ∠DFE=∠M。","故 ∠BAE=∠CAE，AE 平分 ∠BAC。"],[]),
 Q("证明题","上题变式：△ABC 中，AE 平分 ∠BAC（即 ∠BAE=∠CAE），D、E 在 BC 上且 DE=EC，DF∥AB，F 在 AE 上。证明 DF=AC。","DF=AC",["过 C 作 CM∥DF，交 AE 延长线于 M。","由 DF∥AB 和 ∠BAE=∠CAE，可得 ∠M=∠CAE，从而 AC=CM。","又由平行线、对顶角和 DE=EC，可证 △DFE≌△CME。","因此 DF=CM=AC。"],[]),
 Q("证明题","正方形 ABCD 中，E 在 BC 上、F 在 CD 上，∠EAF=45°。证明 EF=BE+DF。","EF=BE+DF",["以 A 为中心把 △ADF 旋转 90° 到 △ABG，则 BG=DF、AG=AF。","利用 ∠EAF=45° 可得 ∠GAE=∠EAF，且 G、B、E 共线。","在 △AGE 和 △AFE 中，AG=AF、AE 公共、夹角相等，所以两三角形 SAS 全等。","EF=EG=BG+BE=DF+BE。"],[]),
 Q("证明题","四边形 ABCD 中，AB=AD，∠B+∠D=180°，E、F 分别在 BC、CD 上，且 ∠EAF=1/2∠BAD。证明 EF=BE+FD。","EF=BE+FD",["延长 FD 到 G，使 DG=BE，连接 AG。","由 ∠B+∠ADC=180° 及邻补角关系得 ∠B=∠ADG；结合 AB=AD、BE=DG，得 △ABE≌△ADG（SAS）。","所以 AE=AG、∠BAE=∠DAG；利用半角条件可得 ∠EAF=∠GAF。","△AEF≌△AGF（SAS），所以 EF=FG=DG+DF=BE+DF。"],[]));
