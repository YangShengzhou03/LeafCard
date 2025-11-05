package com.leafcard.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leafcard.entity.Admin;
import org.apache.ibatis.annotations.Mapper;

/**
 * 管理员Mapper接口
 */
@Mapper
public interface AdminMapper extends BaseMapper<Admin> {
}