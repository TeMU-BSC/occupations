'''
Combine multiple tsv files with `code\tterm` 2-column format.

Original author: https://github.com/mmaguero
'''

import os
import sys
import glob
import pandas as pd
import spacy
from spacy_spanish_lemmatizer import SpacyCustomLemmatizer

# download spacy model
os.system('python -m spacy download es_core_news_md')

# load custom lemma
nlp = spacy.load("es_core_news_md") #, disable=['ner', 'parser']
lemmatizer = SpacyCustomLemmatizer()
nlp.add_pipe(lemmatizer, name="lemmatizer", after="tagger")

# params
path = sys.argv[1]
version = sys.argv[2] # e.g. 111 (X (Major),Y (Minor),Z (patch))


def get_uniques(l, lower=False):
    ulist = []
    if lower:
        [ulist.append(x.strip().lower()) for x in l if x.strip().lower() not in ulist]
    else:
        [ulist.append(x.strip()) for x in l if x.strip() not in ulist]
    return ulist


def get_lemma(text):
    lemma = str()
    for token in nlp(text):
        if token.is_punct:
            lemma += token.lemma_
        else:
            lemma += token.lemma_ + " "
    return lemma


def set_code(df, filter_col, col, codePrefix):
    n = len(str(len(df)))+1
    df = df[df[filter_col]=='False'].reset_index()
    df[col] = df.index
    df[col] = df[col].apply(lambda x: codePrefix+str(x).zfill(n))
    df = df.drop(['index', filter_col], axis=1)
    return df

# read files
tsvs = glob.glob(path + "/*.tsv")
for name in tsvs:
   print(name)

   if "decs" in name.lower():
       decs = pd.read_csv(name, sep='\t', header=None, usecols = [0,1,2], names=['decs_cod_1','decs_cod_2','term'], dtype=str)
   elif "sumo" in name.lower():
       wnsumo = pd.read_csv(name, sep='\t', header=None, usecols = [0,1,2], names=['wnsumo_cod_1','wnsumo_cod_2','term'], dtype=str)
   elif "to" in name.lower():
       wntop = pd.read_csv(name, sep='\t', header=None, usecols = [0,1,2], names=['wntop_cod_1','wntop_cod_2','term'], dtype=str) 
   elif "snomed-ct" in name.lower():
       snomedct = pd.read_csv(name, sep='\t', header=None, usecols = [0,1], names=['snomedct_cod_1','term'], dtype=str)   
   elif "umls" in name.lower():
       sctumls = pd.read_csv(name, sep='\t', header=None, usecols = [0,1,2], names=['sctumls_cod_1','sctumls_cod_2','term'], dtype=str) 
   elif "cno11" in name.lower():
       ine = pd.read_csv(name, sep='\t', header=None, usecols = [0,1], names=['ine_cod_1','term'], dtype=str) 
   elif "esco" in name.lower():
       esco = pd.read_csv(name, sep='\t', header=None, usecols = [0,1], names=['esco_cod_1','term'], dtype=str)   
   elif "kbp" in name.lower() :
       scnlp = pd.read_csv(name, sep='\t', header=None, usecols = [0,1], names=['scnlp_cod_1','term'], dtype=str)  
   elif "corenlp" in name.lower():
       codePrefix = "scnlp400-"
       if "tweet" in name.lower():
           codePrefix += "tweet-"
           scnlp_tweet = pd.read_csv(name, sep='\t', header=0, usecols = [0,1], names=['term','in_dict'], dtype=str)
           scnlp_tweet = set_code(scnlp_tweet, 'in_dict', 'scnlp_tweet_cod_1', codePrefix)
           scnlp_tweet.info()
       if "profile" in name.lower():
           codePrefix += "profile-" 
           scnlp_profile = pd.read_csv(name, sep='\t', header=0, usecols = [0,1], names=['term','in_dict'], dtype=str)
           scnlp_profile = set_code(scnlp_profile, 'in_dict', 'scnlp_profile_cod_1', codePrefix)
           scnlp_profile.info()

# merge
decs_wnsumo = decs.merge(wnsumo,on=['term'], how='outer')
decs_wnsumo_wntop = decs_wnsumo.merge(wntop,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct = decs_wnsumo_wntop.merge(snomedct,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct_sctumls = decs_wnsumo_wntop_snomedct.merge(sctumls,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct_sctumls_ine = decs_wnsumo_wntop_snomedct_sctumls.merge(ine,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct_sctumls_ine_esco = decs_wnsumo_wntop_snomedct_sctumls_ine.merge(esco,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct_sctumls_ine_esco_scnlp = decs_wnsumo_wntop_snomedct_sctumls_ine_esco.merge(scnlp,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct_sctumls_ine_esco_scnlp_tweet = decs_wnsumo_wntop_snomedct_sctumls_ine_esco_scnlp.merge(scnlp_tweet,on=['term'], how='outer')
decs_wnsumo_wntop_snomedct_sctumls_ine_esco_scnlp_tweet_profile = decs_wnsumo_wntop_snomedct_sctumls_ine_esco_scnlp_tweet.merge(scnlp_profile,on=['term'], how='outer')


# check data
df = decs_wnsumo_wntop_snomedct_sctumls_ine_esco_scnlp_tweet_profile
print("merge by term info","*"*16)
df.info()

# only uniques
df = df.astype(str)
df = df.groupby(['term']).agg({
    'decs_cod_1':'|'.join,  
    'decs_cod_2':'|'.join,  
    'snomedct_cod_1':'|'.join,  
    'sctumls_cod_1':'|'.join,  
    'sctumls_cod_2':'|'.join,  
    'wnsumo_cod_1':'|'.join,   
    'wnsumo_cod_2':'|'.join,  
    'wntop_cod_1':'|'.join,  
    'wntop_cod_2':'|'.join,  
    'ine_cod_1':'|'.join,
    'esco_cod_1':'|'.join,
    'scnlp_cod_1':'|'.join,
    'scnlp_tweet_cod_1':'|'.join,
    'scnlp_profile_cod_1':'|'.join    
}).reset_index()

# Drop duplicate mention of cod in column group
for column in df:
    if column != 'term':
        df[column] = df[column].apply(lambda a: '|'.join(get_uniques(a.split('|'))))

# check data again
print("group by term info","*"*16)
df.info()

# add extra columns
print("add extra columns","*"*16)

# term to lower
df['term_lowercase'] = df['term'].apply(lambda a: a.lower())

# term to lemma
df['term_lemma'] = df['term'].apply(lambda a: get_lemma(str(a)))

# term gender 
#NOUN__Gender=Masc|Number=Plur spacy

# export to tsv
df.to_csv(path+'/dicts'+'/raw_dict_v'+version+'.tsv', sep='\t', encoding='utf-8', index=False)
