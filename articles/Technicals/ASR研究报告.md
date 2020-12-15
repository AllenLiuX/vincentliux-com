# ASR研究报告

[TOC]



## 成果

### Aidatatang - 端到端识别系统

#### 效果

- 批量将mp3或wav音频生成普强格式的XML识别结果文件，可导入慧捷分析系统。
- 转译速度实现多线程。以8线程运行为，识别时长可达到录音时长的约1/8。
- 识别结果包含文字，分句，对应词语的时间戳，静音片段，说话人，平均语速，录音位置和时长等信息。

#### 流程

- 进入内部服务器192.168.2.103, User: gpu, password: \*\*\*\*\*\*
2. 进入文件夹位置：/home/gpu/kaldi-master/egs/aidatatang_asr
3. 把双声道的mp3或wav的一个或多个文件放入一个文件夹下，并运行sudo ./asr.sh <文件夹名>/  (注意文件夹末尾必须加'/')
4. 脚本将会执行sox.sh，run2.sh, get_ctm_fast.sh, 和ctm_to_xml.sh。./run2.sh将会持续一段时间，大概是录音文件总时长的1/10。
5. 若执行成功，转译文本结果将会在exp/chain/tdnn_1a_sp/decode_offline_test\_\<time>/rec_\<time>.txt.\<time>为翻译时的中国时间。同理，时间戳文件ctm和标准格式xml文件将在文件夹./CTMs和./XMLs下的对应时间文件夹。

#### 实现方法

- asr.sh: 依次执行转译的步骤，sox.sh做音频各式处理，run.sh做转译，get_ctm_fast做时间戳提取，ctm_to_xml做xml结果生成。
2. sox.sh: 输入一个放着mp3或wav的文件夹，将每个文件的两个声道剥离并分别变为16000Hz的wav单声道文件，存于此文件夹的sox_res文件夹下。并生成一个sounds_info文件，储存每个录音的时长和位置供生成xml使用。
3. run2.sh: 输入一个放着16000HZ单声道录音的文件夹，输出decode转译结果并生成Lat.*.gz过程文件。可修改并发数量nj，默认为10。
4. get_ctm_fast.sh: 提取lat.1.gz里的时间戳部分，放入ctm文件中。
- ctm_to_xml.py: 将所有录音根据录音名和左右声道两两匹配，根据每个词的时间顺序和间隔自动分句，计算语速和静音片段，把所有ctm文件转换成一个个左右声道合并的xml文件结果。
7. xml_cleaner.py: 把xml里的'\[_-][0-9]+'去掉，此为修改词表graph/words.txt的过程参数(unique id)。

#### 语言模型优化

##### 原理

- 识别过程主要依赖的文件为语音模型final.mdl和语言模型HCLG.fst，里面的参数无法修改。语言模型的中文转换依赖于词表words.txt，所以可通过批量替换词表里的字来调整语言包，并相应影响语言模型决策树scoring时的路径选择。
- 目标：将五十万左右的词中的相当一部分替换成行业相关的词语，从而使达到限定识别结果范围的目的。
- 问题：无法修改语言模型用于HMM的限定状态机的概率参数，所以强行替换将损失被替换词语的全部可能。

##### 方法

- **拼音强制转换**
  - 制作一个列表的常用词语，把words.txt里的全部相同拼音（忽视音调）的词语替换成对应词语。
  - ./alter.py -p
- **泛词转换**
  - 制作一个列表储存两两对应的词和被替换词，批量把words.txt里的词语指定替换。
  - ./alter.py -s
- **分词逻辑转换**
  - 直接修改生成后的结果，比如将多个连续词变为一个词。需要逻辑建模。

##### 脚本

- alter.py: Two modes:
  a) Forceful translation of certain pinyin to certain words. Use -p(--pinyin), with optional -f=wordbank, where wordbank is the file storing target words.
  b) Substitute certain words into other words. Use -s or --sub=change, where change stores the paired two words '[ori] [sub]'

#### 测评工具

- 基于DeepSpeech开源的levenshtein_distance编辑距离动态规划算法，计算两段文本增加，删除，和替换的字错误率。
- rate.py <正确文本> <翻译文本>。正确文本需手动部署，格式为每行“无后缀文件名 文本内容“，翻译文本通过ctm在ctm_to_xml.py脚本自动生成位于XMLs/xml_*/all_text.txt。批量计算每条录音的错误率并计算总平均错误率。可用于语言模型修改效果比对。



### CVTE - 开源模型asr

#### 效果

- 批量将mp3或wav音频进行数据部署，并生成txt识别结果
- 无phone和ctm时间戳

#### 实验过程

- 将音频文件放入data/wav/filename中
- 新建data/filename/test文件夹，并在其中创建text、utt2spk、spk2utt、wav.scp文件，text中保存标签数据，wav.scp中保存音频路径，utt2spk、spk2utt中保存音频与说话人的关系。
- 每次运行后需删除data/filename/test中的cmvn.scp文件，否则会报错。
- 创建好data/filename/test中相应文件后，可使用utils/validate_data_dir.sh进行检查（需加上 --no-feats）
- 运行run.sh开始语音识别，运行前需修改run.sh中的路径（有三处）
- 在exp/chain/tdnn/decode_filename/scoring_kaldi/中可查看识别结果，对于不同的参数会有不同的结果，可通过best_cer（best_wer）查看最优结果对应参数（记为参数a）参数包括inv-acoustic-scale∈[7,17] ，word-ins-penalty∈{0.0,0.5,1.0}。
- 猜测：最优识别结果对应的参数（参数a）是最适合对此类语音数据进行识别的参数。在没有text文件的情况下，最优结果大概率存在于使用参数a得到的结果中。
- 对于不同的数据集，需要进行测试以获取最优参数

#### 实验结果分析

- 实验数据为huijie28条语音数据，带有ground truth。经测试，最佳参数为inv-acoustic-scale=16， word-ins-penalty=0.0，测试结果的平均cer（字错误率）为50.18

#### 流程

- 将音频文件（wav格式）放入/kaldi-master/egs/cvte/s5/data/wav/filename中；
- 将text文件放入/kaldi-master/egs/cvte/s5/data/test_filename/test中，text格式为“音频ID    文字标签\r\n”（中间为Tab）；
- 将conf与frame_shift放入test文件夹；
- 运行s5文件夹中的asr.sh，将进行整个识别流程。（asr.sh非cvte自带，其中文件路径需自行修改）。首先将自动生成wav.scp、utt2spk、spk2utt文件，并删除可能造成冲突的文件，然后开始语音识别；
- 识别结果将保存于/kaldi-master/egs/cvte/s5/exp/chain/tdnn/decode_filename/scoring_kaldi/中。若text文件中含有真实标签，则可查看最佳参数。打开最佳参数对应的文件夹可查看识别结果。

#### 难点

- 无官方文档，相关参考资料较少
- 模型封装完整，无法进行修改，无法使用迁移学习进行模型优化
- 因未提供相关解码文件，无法获取时间戳信息

#### 参考

- https://chatopera.blog.csdn.net/article/details/107733688

  https://blog.csdn.net/samurais/article/details/107889376

  https://blog.csdn.net/tcx1992/article/details/85717100

  https://github.com/tcxdgit/ASR_utils

  https://blog.csdn.net/benbenls/article/details/102691710

### DeepSpeech2

DeepSpeech2是一个采用PaddlePaddle平台的端到端自动语音识别引擎的开源项目，具体原理参考论文Baidu's Deep Speech 2 paper。

#### 环境配置

- 使用官方镜像，运行失败。原因：PaddlePaddle版本不匹配，缺少RNN模块等关键组件；尝试进行修改后发现CUDNN版本也不匹配；
- 使用带有正确版本CUDA与CUDNN的镜像，手动安装PaddlePaddle，安装成功后clone DeepSpeech2项目，根据setup.sh进行相关依赖的安装与配置。注意镜像中缺少git、swig等基础命令或依赖包的安装，需通过apt-get进行安装。

#### 数据准备及使用方式：

- 下载BaiduCN1.2k Model语音模型与Mandarin LM Small语言模型；
- 自行准备manifest文件，其中包括每条音频的存储路径，音频时长与数据标签（文本）。文本中不能含有标点符号、英文字母与阿拉伯数字。格式为：{"audio_filepath": "", "duration": , "text": ""}
- 使用如下命令可进行自定义语音音频识别

PYTHONIOENCODING=utf-8 // 需设定编码方式为utf-8，否则会出现错误；

python infer.py 

--num_samples 1 //识别语音条数

--infer_manifest data/mydata/manifest //manifest文件路径

--use_gru TRUE //使用门控循环单元

--use_gpu FALSE 

--mean_std_path models/baidu_ch1.2k/mean_std.npz //样本特征的均值与标准差

--vocab_path models/baidu_ch1.2k/vocab.txt //字典路径

--lang_model_path models/lm/zh_giga.no_cna_cmn.prune01244.klm //语言模型路径

--model_path models/baidu_ch1.2k //语音模型路径

--num_conv_layers=2 //卷积层数量

--num_rnn_layers=3 //循环神经网络配置

--rnn_layer_size=2048 

--share_rnn_weights=False 

--specgram_type='linear' 

--error_rate_type=cer //错误率类型设置为字错误率

--alpha=0.4 

--beta=0.3

- 使用tools/tune.py可使用不同参数进行识别，以找出最优参数。参数包括alpha与beta，分别为语言模型权重与单词插入权重。
- 使用tools/compute_mean_std.py和tools/build_vocab.py可获得自定义样本的特征均值、标准差（用于归一化）与字典；
- 相关命令及运行参数保存在command.txt中，方便使用。

#### 实验结果分析

- 实验数据为huijie100条语音数据，带有ground truth。使用BaiduCN1.2k Model语音模型与Mandarin LM Small语言模型，使用预训练模型的数据特征（即归一化方式）与字典，经测试，最佳运行参数为alpha=0.4， beta =0.3，测试结果的平均cer（字错误率）为55.19%
- 将语音模型替换为Aishell模型进行实验，错误率升高

#### 迁移学习

在公开的模型上使用自己的数据集进行迁移训练

- 准备工作

1）修改词典中的阿拉伯数字为中文；

2）将正确数据标签中所有阿拉伯数字换为中文，去除所有标点符号与英文字母；

3）按照要求生成manifest.train文件，包含训练数据路径，时长与标签；

4）预处理出训练集数据特征的均值与标准差；

5）若要修改字典（添加或删除），则需要修改神经网络模型的结构，较为复杂；

- 运行train.py进行训练，参数如下

PYTHONIOENCODING=utf-8 

python train.py 

--batch_size 16 //批量大小

--num_epoch 10 //训练周期数

--num_conv_layers=2 

--num_rnn_layers=3 

--rnn_layer_size=2048 

--share_rnn_weights=False 

--save_epoch 1 //每训练一个epoch进行一次模型保存

--num_samples 80 

--learning_rate 0.05 //学习率，需调优

--max_duration 130 //最大音频时长

--use_gpu FALSE 

--use_gru TRUE 

--init_from_pretrained_model models/baidu_ch1.2k 

--train_manifest data/mydata/manifest.huijie //训练集路径

--dev_manifest data/mydata/manifest //验证集路径

--mean_std_path models/baidu_ch1.2k/mean_std.npz //可选择模型预训练时使用的数据的特征（即models/baidu_ch1.2k/mean_std.npz），或是当前进行迁移学习的数据的特征（data/mydata/ mean_std.npz）

--vocab_path models/baidu_ch1.2k/vocab_new.txt 

--output_model_dir models/baidu_ch1.2k_new //新模型保存位置

--num_iter_print 1 //每一个epoch输出一次信息

--test_off TRUE//训练过程中是否进行验证 

##### 难点

- 环境难以配置，官方镜像存在问题，配置环境花费大量时间；
- 暂无法成功在docker中使用gpu，导致训练与识别速度非常慢；
- （15h仅训练了6个epoch）
- 自定义训练数据的特征均值和标准差与预训练模型使用的数据不同，导致迁移学习效果较差
- 若需修改字典，则必须深入了解DeepSpeech模型结构与修改方式，深入学习PaddlePaddle框架

##### Todo

- 结合预训练时使用的数据的特征，对我们的音频数据进行预处理，再进行迁移训练
- 修改字典，修改网络模型，使最后的全连接层与自定义字典相匹配
- 使用更大型的语言模型Mandarin LM Large

##### 参考文档

https://github.com/PaddlePaddle/DeepSpeech/blob/develop/README_cn.md

https://www.paddlepaddle.org.cn/install/quick

https://baijiahao.baidu.com/s?id=1675202226359497084&wfr=spider&for=pc

 

## 尝试

### Aidatatang模型训练

### 音频预处理



## 计划

- 从音频文件的预处理着手，包括降噪、提升音质、音量平衡、特征增强等
- 通过比对识别结果和正确文本，批量用脚本修改行业词表
- 进行迁移训练
- 增加约束条件，处理识别结果，提高准确率
- 深入了解算法与模型（包括GMM、HMM、N-gram、WFST、TDNN、DNN等），从模型层面进行优化