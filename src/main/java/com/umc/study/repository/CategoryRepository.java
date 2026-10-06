package com.umc.study.repository;

import com.umc.study.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

// findById, save 같은 기본 CRUD 메서드는 JpaRepository가 만들어 준다. SQL은 한 줄도 쓰지 않는다.
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
